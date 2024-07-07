// Code taken from repo textalive-app-dance
import * as THREE from "three";
import Globals from "../core/Globals";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { SceneBase } from "./SceneBase";
import { Skybox } from "./Skybox";
import { Buildings } from "./Buildings";
import { CameraManager } from "./CameraManager";
import { LyricsPlacer } from "./Lyrics";

export class ThreeManager {
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _sceneBuilder: Buildings;
    private _camera: CameraManager;
    private stats: Stats;

    private _rootObj: THREE.Group;
    private _objMngs: { [key: string]: SceneBase } = {};

    private collisionPoint: THREE.Vector3;

    constructor() {
        Globals.controls!.setReady("scene", false);
        this._view = document.querySelector("#view")!;
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        this._view.appendChild(this._renderer.domElement);

        const _init = this.initialize.bind(this);
        window.addEventListener("songchanged", _init);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        let interval = setInterval(() => {
            console.log("waiting for textures");
            if (Globals.textures!.isReady) {
                console.log("textures ready in threemanager");
                clearInterval(interval);
                this.initialize();
            }
        }, 800);
    }

    public initialize() {
        this._scene = new THREE.Scene();
        this._rootObj = new THREE.Group();
        this._scene.add(this._rootObj);
        // ADD SCENE OBJECTS PARENTED TO ROOTOBJ

        this._camera = new CameraManager(this._scene, this._renderer);
        this._camera.initialize();

        var skybox = new Skybox(this._camera.getCamGlobal(), this._scene);
        skybox.initialize();
        this._objMngs["skybox"] = skybox;

        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(400, 400, 1, 1),
            new THREE.MeshStandardMaterial({
                color: 0x333333,
                side: THREE.DoubleSide,
            }),
        );
        plane.receiveShadow = true;
        this._camera.getCamGlobal().add(plane);
        plane.rotateX(Math.PI / 2);
        plane.position.set(0, -3, 0);

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        var buildings = (this._sceneBuilder = new Buildings(this._rootObj));
        buildings.initialize();
        this._objMngs["buildings"] = buildings;

        var dir = this._camera.getDirectVector();
        var pos = this._camera.getCam().position.clone();
        console.log(pos, dir);
        this.collisionPoint = buildings.plotAndBuild(
            this._camera.getCamGlobal().position,
            100,
            0,
        );
        console.log("DONE WITH FIRST BUILD");

        var lyrics = new LyricsPlacer(this._rootObj, this._camera.getCamGlobal());
        this._objMngs["lyrics"] = lyrics;

        const loader = new GLTFLoader();
        // this works, only on the actual page
        loader.load(
            "./scene.gltf",
            (gltf) => {
                gltf.scene.position.set(0, 0, 0);
                this._scene.add(gltf.scene);
            },
            undefined,
            (error) => {
                console.error(error);
            },
        );
        this.resize();

        Globals.controls!.setReady("scene", true);
        this._renderer.setAnimationLoop(this._update.bind(this));

        var alight = new THREE.AmbientLight(0x404040);
        this._scene.add(alight);
        var dlight = new THREE.DirectionalLight(0xffffff, 0.75);
        dlight.position.set(-5, 5, -5);
        dlight.castShadow = true;
        this._scene.add(dlight);
        Globals.controls?.onStop(() => {
            this.reset();
        });
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public placeLyrics(p: any) {
        this._objMngs["lyrics"].placeLyrics(p);
    }

    public update(time: number) {
        this._camera.songUpdate(time);
        this._sceneBuilder.songUpdate(time);
    }

    public reset() {
        this._objMngs["buildings"].setKeyframeIndex(1);
        this.collisionPoint = this._objMngs["buildings"].plotAndBuild(
            new THREE.Vector3(0, 0, 0),
            100,
            0,
        );
    }

    public _update() {
        let cam = this._camera.getCam();

        this.stats.update();

        this._camera.update();

        if ( this._camera.getCamGlobal().position.distanceTo(this.collisionPoint) < 200 ) {
            this.collisionPoint = this._objMngs["buildings"].plotAndBuild(
                this.collisionPoint,
                60,
                0,
            );
        }

        this._renderer.render(this._scene, cam);
    }

    // params currently kinda useless
    public _onParamsChanged() {
        for (let objMng of Object.values(this._objMngs)) {
            objMng._onParamsChanged();
        }
    }
}
