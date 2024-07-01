import * as THREE from "three";
import { SceneBase } from "./SceneBase";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";

export class CameraManager extends SceneBase {
    private _camera: THREE.Camera;
    private fakeCam: THREE.Camera;

    private camGlobalPosition: THREE.Group;
    private camLocalOffset: THREE.Group;
    private cameraTarget: THREE.Vector3;

    private shouldBeAt: THREE.Vector3;
    private swayShouldBeAt: THREE.Vector3;

    private direction: THREE.Vector3;

    private _renderer: THREE.Renderer;
    private _controls: OrbitControls;

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

        this.shouldBeAt = new THREE.Vector3(0, 0, 0);
        this.swayShouldBeAt = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3();

        this.camLocalOffset = new THREE.Group();
        this.camGlobalPosition = new THREE.Group();

        this.camLocalOffset.add(this._camera);
        this.camGlobalPosition.add(this.camLocalOffset);
        this._parentObject.add(this.camGlobalPosition);

        this.fakeCam = this._camera.clone();
        this._controls = new OrbitControls(this.fakeCam, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        this._controls.enableZoom = false;
        this._controls.enablePan = false;

        this._controls.target = this.cameraTarget;
        this._controls.update;
        this._camera.copy(this.fakeCam);
    }

    public add(child) {
        this.camGlobalPosition.add(child);
    }

    public getDirection(direcVec) {
        this.direction.setX(direcVec.x);
        this.direction.setY(direcVec.y);
        this.direction.setZ(direcVec.z);
    }

    public getDirectVector() {
        return this.direction;
    }

    public getCam() {
        return this._camera;
    }

    public getCamParent() {
        return this.camGlobalPosition;
    }

    public reset() {
        this.shouldBeAt.set(0, 0, 0);
    }

    public getCamSubParent() {
        return this.camLocalOffset;
    }

    private songClock = new THREE.Clock();

    public songUpdate(time: number) {
        var t = time / 1000;

        this.swayShouldBeAt.setX(Math.sin(t) / 4);
        this.swayShouldBeAt.setY(Math.cos(t * 2) / 2 + 0.5);

        let deltaTime = this.songClock.getDelta();

        this.getDirection(Globals.sceneParams.camera?.direction);
        this.shouldBeAt.add(
            this.direction.multiplyScalar(
                deltaTime * Globals.sceneParams.camera?.relativeSpeed * 3,
            ),
        );
    }

    private updateClock = new THREE.Clock();

    public update() {
        let deltaTime = this.updateClock.getDelta();
        this.camGlobalPosition.position.lerp(this.shouldBeAt, deltaTime * 10);
        this.camLocalOffset.position.lerp(this.swayShouldBeAt, deltaTime * 10);

        this._controls.update;
        this._camera.copy(this.fakeCam);

        document.querySelector("#debug")!.innerHTML =
            `x: ${this.camGlobalPosition.position.x.toFixed(2)}, y: ${this.camGlobalPosition.position.y.toFixed(2)}, z: ${this.camGlobalPosition.position.z.toFixed(2)}`;
        document.querySelector("#debug")!.innerHTML +=
            `x: ${this.shouldBeAt.x.toFixed(2)}, y: ${this.shouldBeAt.y.toFixed(2)}, z: ${this.shouldBeAt.z.toFixed(2)}`;
    }

    public _onParamsChanged(params) { }
}
