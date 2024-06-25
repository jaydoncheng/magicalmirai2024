// Code taken from repo textalive-app-dance
import * as THREE from "three";
import { Building } from "./Building";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";
import { SceneBuilder } from "./SceneBuilder";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class SceneManager {
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
    private _sceneBuilder: SceneBuilder;

    private startingPos: THREE.Vector3;
    private cameraTarget: THREE.Vector3;
    private textCanvas: HTMLCanvasElement;
    private textPlane: THREE.Mesh;

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
    }

    public initialize() {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        var { colors } = Globals.currentSong.keyframes["0"];

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // -------------------- this gotta be its own thing --------------------------------
        this._sceneBuilder = new SceneBuilder(this._scene, colors);
        this._sceneBuilder.build();

        this._camera.position.z = 5;
        this._camera.position.y = 1.5;

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
        // const loader = new GLTFLoader();
        // loader.load(
        //     "../assets/scene.gltf",
        //     (gltf) => {
        //         gltf.scene.position.set(0, 0, 0);
        //         this._scene.add(gltf.scene);
        //     },
        //     undefined,
        //     (error) => {
        //         console.error(error);
        //     },
        // );
        // ----------------------------------------------------------------------
        this.startingPos = this._camera.position.clone();
        this.cameraTarget = this._camera.position.clone();
        this.resize();

        Globals.controls!.setReady("scene", true);
        this._renderer.setAnimationLoop(this._update.bind(this));
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
        this.textPlane.material.dispose();
        this.textPlane.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        this.textPlane.position.x = (-canvas.width * 0.02) / 2;
        this.cameraTarget = this.textPlane.position.clone();
    }

    private shouldBeAt = new THREE.Vector3();
    public update(time: number) {
        var t = time / 1000;
        this.shouldBeAt.z = time / 100;
        this.shouldBeAt.x = Math.sin(t) / 4;
        this.shouldBeAt.y = Math.cos(t * 2) / 2 + 0.5;

        this.textPlane.position.z = -(time / 100) - 7;
        this.textPlane.position.x = -Math.sin(t) / 2;
        this.textPlane.lookAt(this._camera.position);
    }

    private _clock = new THREE.Clock();
    private prevPos = new THREE.Vector3(0, 0, 0);
    public _update() {
        var newPos = this.startingPos.clone().sub(this.shouldBeAt);
        if (this.prevPos.distanceTo(newPos) > 2) {
            this._sceneBuilder.populate(this.prevPos, newPos);
            this.prevPos = newPos;
        }
        // this._camera.position.lerp(newPos, this._clock.getDelta() * 10);
        // this._camera.lookAt(this.textPlane.position);

        this._renderer.render(this._scene, this._camera);
        this._controls.update();
    }

    public addBuilding(building: Building) {
        this._scene.add(building.buildingBox);
    }
}
