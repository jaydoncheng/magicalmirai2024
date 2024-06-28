// Code taken from repo textalive-app-dance
import * as THREE from "three";
import { Building } from "./Building";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";
import { SceneBuilder } from "./SceneBuilder";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { SceneBase } from "./SceneBase";
import { Skybox } from "./Skybox";
import { Buildings } from "./Buildings";

export class ThreeManager {
    // TODO: ok so
    // scene initialization and populating the scene with objects should
    // probably be done separately, since building prefabs need to be
    // fetched, loaded, etc.
    //
    // this class will then be responsible for:
    // - initializing the renderer and scene,
    // - calling the whatever function/class/system that will populate the scene
    //      - additionally this whatever will probably also handle lighting?
    // - handle the song change events n shit and pass it downstream
    // - post processing
    // and probably a bunch of other misc shit. it needs to expose a
    // small API to PlayerManager which lets PM update elements in the
    // scenes as well as control camera n shit
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private _controls;
    private _sceneBuilder: Buildings;

    private startingPos: THREE.Vector3;

    private camParent: THREE.Group;
    private camSubParent: THREE.Group; // takes the camera target into account
    private cameraTarget: THREE.Vector3;
    private camHelper: THREE.Vector3;
    private fakeCam: THREE.Camera;
    private direction: number;

    private textCanvas: HTMLCanvasElement;
    private textPlane: THREE.Mesh;

    private stats: Stats;

    private _rootObj : THREE.Group;
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

        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );


        this._camera.position.set(0, 1, -0.001);

        this.cameraTarget = new THREE.Vector3(0, 1, 0);
        // offset target to replicate first person
        this.camHelper = new THREE.Vector3();

        this.camSubParent = new THREE.Group();
        this.camParent = new THREE.Group();
        this.camSubParent.add(this._camera);
        this.camParent.add(this.camSubParent);

        this._scene.add(this.camParent);

        this.fakeCam = this._camera.clone();
        this._controls = new OrbitControls(this.fakeCam, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;
        // this._controls.enablePan = false;
        // this._controls.enableZoom = false;

        this._controls.target = this.cameraTarget;
        this._controls.update;
        this._camera.copy(this.fakeCam);
        this.direction = 0;

        var colors = Globals.sceneParams.palette;

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // -------------------- this gotta be its own thing --------------------------------
        var buildings = this._sceneBuilder = new Buildings(this._rootObj);
        buildings.initialize();

        // this._camera.position.z = 5;
        // this._camera.position.y = 1.5;

        var canvas = (this.textCanvas = document.createElement("canvas"));

        var texture = new THREE.CanvasTexture(canvas);

        const scale = 0.02;
        const height = canvas.height * scale;
        const width = canvas.width * scale;
        var textPlane = (this.textPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height, 32, 32),
            new THREE.MeshBasicMaterial({ map: texture }),
        ));
        textPlane.position.set(0, 1, -5);
        textPlane.rotation.x = -Math.PI;
        textPlane.rotation.y = Math.PI;
        textPlane.rotation.z = Math.PI;

        this._scene.add(textPlane);

        this.drawText("Hello, world!");
        const loader = new GLTFLoader();
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
        // ----------------------------------------------------------------------
        this.startingPos = this._camera.position.clone();
        this.resize();

        Globals.controls!.setReady("scene", true);
        this._renderer.setAnimationLoop(this._update.bind(this));
    }

    public setDirection(degrees: number) {
        this.direction = degrees;
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public drawText(text: string) {
        var ctx = this.textCanvas.getContext("2d")!;
        var canvas = this.textCanvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        var texture = new THREE.CanvasTexture(canvas);
        // this.textPlane.material.dispose();
        this.textPlane.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        this.textPlane.position.x = (-canvas.width * 0.02) / 2;
        // this.cameraTarget = this.textPlane.position.clone();
    }

    private shouldBeAt = new THREE.Vector3();
    private directionVector = new THREE.Vector3();
    private started = false;
    public update(time: number) {
        this.started = true;
        var t = time / 1000;
        // this.shouldBeAt.z = time / 100;
        this.camSubParent.position.x = Math.sin(t) / 4;
        this.camSubParent.position.y = Math.cos(t * 2) / 2 + 0.5;

        this.textPlane.position.copy(this.camParent.position);
        this.textPlane.position.z += 7;
        this.textPlane.position.x = -Math.sin(t) / 2;
        this.textPlane.lookAt(this._camera.position);

        let deg = (this.direction * Math.PI) / 180;

        this.directionVector.set(Math.sin(deg), 0, Math.cos(deg));

        this.shouldBeAt.copy(this.camParent.position);
        this.shouldBeAt.add(this.directionVector);
    }

    private _clock = new THREE.Clock();
    private prevPos = new THREE.Vector3(0, 0, 0);
    private _x = new THREE.Vector3();
    private buildCount = 0;
    public _update() {
        if (this.prevPos.distanceTo(this.shouldBeAt) > 2) {
            this._sceneBuilder.populate(this.camParent.position, this.shouldBeAt);
            this.prevPos.copy(this.camParent.position);
            this.buildCount++;
            // if (this.buildCount >= 15) {
            //     this._sceneBuilder.deleteBlock();
            // }
        }

        document.querySelector("#debug")!.innerHTML = `x: ${this.camParent.position.x.toFixed(2)}, y: ${this.camParent.position.y.toFixed(2)}, z: ${this.camParent.position.z.toFixed(2)}`;
        document.querySelector("#debug")!.innerHTML += `x: ${this.shouldBeAt.x.toFixed(2)}, y: ${this.shouldBeAt.y.toFixed(2)}, z: ${this.shouldBeAt.z.toFixed(2)}`;

        if (this.started) {
            this.camParent.position.lerp(
                this.shouldBeAt,
                this._clock.getDelta() * 10,
            );
        }

        this._camera.getWorldPosition(this._x);
        this._camera.copy(this.fakeCam);
        this._camera.getWorldPosition(this._x);
        this.stats.update();

        this._renderer.render(this._scene, this._camera);
    }

    public addBuilding(building: Building) {
        this._scene.add(building.buildingBox);
    }

    public _onParamsChanged(params: any) {
        for (let manager of this.managers) {
            manager._onParamsChanged(params);
        }
    }
        
}
