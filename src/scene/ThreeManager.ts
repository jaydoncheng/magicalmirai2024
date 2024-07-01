// Code taken from repo textalive-app-dance
import * as THREE from "three";
import Globals from "../core/Globals";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { SceneBase } from "./SceneBase";
import { Skybox } from "./Skybox";
import { Buildings } from "./Buildings";
import { Building, p_TwistyTower } from "./Building";
import { CameraManager } from "./CameraManager";


export class ThreeManager {
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _sceneBuilder: Buildings;
    private _camera: CameraManager;
    private stats: Stats;

    private _rootObj : THREE.Group;
    private _objMngs : { [key: string] : SceneBase } = {};
    constructor() {
        Globals.controls!.setReady("scene", false);
        this._view = document.querySelector("#view")!;
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        this._view.appendChild(this._renderer.domElement);
        this.initialize();

        const _init = this.initialize.bind(this);
        window.addEventListener("songchanged", _init);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    public initialize() {
        this._scene = new THREE.Scene();
        this._rootObj = new THREE.Group();
        this._scene.add(this._rootObj);
        // ADD SCENE OBJECTS PARENTED TO ROOTOBJ

        var skybox = new Skybox(this._rootObj, this._scene);
        skybox.initialize();
        this._objMngs["skybox"] = skybox;

        this._camera = new CameraManager(this._scene, this._renderer);

        // var colors = Globals.sceneParams.palette;

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // var buildings = this._sceneBuilder = new Buildings(this._rootObj);
        // buildings.initialize();
        // this._objMngs["buildings"] = buildings;

        // this._camera.add(this._sceneBuilder.getPlane());
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
        var plight = new THREE.PointLight(0xffffff, 1, 100);
        plight.position.set(0, 10, 0);
        this._scene.add(plight);

        var building = new Building(this._rootObj);
        this._objMngs["buildingnew"] = building;
        for (let i = 0; i < 10; i++) {
            var m = building.base(p_TwistyTower());
            m.mesh.position.x = i * 20;
            m.debug_mesh.position.x = i * 20;
        }
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public update(time: number) {
        var t = time / 1000;

        this._camera.songUpdate(time);

        let cam = this._camera.getCam();
        let camGlobalPosition = this._camera.getCamParent();
    }

    private buildCount = 0;

    private buildSet() {
        let camGlobalPosition = this._camera.getCamParent();
        this._camera.getDirection(Globals.sceneParams.camera.direction);
        this._sceneBuilder.populate(
            camGlobalPosition.position,
            camGlobalPosition.position.add(this._camera.getDirectVector()),
        );
        this.buildCount++;
        // if (this.buildCount >= 15) {
        //   this._sceneBuilder.deleteBlock();
        // }
    }

    public _update() {
        let cam = this._camera.getCam();

        this.stats.update();

        this._camera.update();

        this._renderer.render(this._scene, cam);
    }

    public addBuilding(building: Building) {
        this._scene.add(building.buildingBox);
    }

    // params currently kinda useless
    public _onParamsChanged(params: any) {
        for (let objMng of Object.values(this._objMngs)) {
            objMng._onParamsChanged(params);
        }
    }
}
