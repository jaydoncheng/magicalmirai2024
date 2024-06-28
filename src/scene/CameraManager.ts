import * as THREE from "three";
import { SceneBase } from "./SceneBase";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";

export class CameraManager extends SceneBase {
    private _camera: THREE.Camera;
    private fakeCam: THREE.Camera;
    private camParent: THREE.Group;
    private camSubParent: THREE.Group; // takes the camera target into account
    private cameraTarget: THREE.Vector3;
    private startingPos: THREE.Vector3;
    private direction: number;

    private _renderer: THREE.Renderer;
    private _controls: OrbitControls;
    private worldLoc: THREE.Vector3;

    constructor(parentScene: THREE.Scene, renderer: THREE.Renderer) {
        super(parentScene);
        this._renderer = renderer;
        this.initialize();
    }

    public initialize() {
        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this._camera.position.set(0, 1, -0.001);

        this.cameraTarget = new THREE.Vector3(0, 1, 0);
        // offset target to replicate first person

        this.direction = 0;

        this.camSubParent = new THREE.Group();
        this.camParent = new THREE.Group();
        this.camSubParent.add(this._camera);
        this.camParent.add(this.camSubParent);
        this._parentScene.add(this.camParent);
        this.worldLoc = new THREE.Vector3();

        this.fakeCam = this._camera.clone();
        this._controls = new OrbitControls(this.fakeCam, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        this._controls.target = this.cameraTarget;
        this._controls.update;
        this._camera.copy(this.fakeCam);

        this.startingPos = this._camera.position.clone();
    }

    public add(child) {
        this.camParent.add(child);
    }

    private _x = new THREE.Vector3();

    public update() {
        this._controls.update;
        this._camera.getWorldPosition(this._x);
        this._camera.copy(this.fakeCam);
        this._camera.getWorldPosition(this.worldLoc);
        this._camera.getWorldPosition(this._x);
        this._controls.update;
    }

    public _onParamsChanged(params) { }

    public position() {
        return this.worldLoc;
    }

    public setStart(start) {
        this.startingPos = start;
    }

    public getCam() {
        return this._camera;
    }

    public getCamParent() {
        return this.camParent;
    }

    public getCamSubParent() {
        return this.camSubParent;
    }

    public getDirection() {
        return this.direction;
    }
}
