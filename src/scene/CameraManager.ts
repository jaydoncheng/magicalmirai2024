import * as THREE from "three";
import { SceneBase } from "./SceneBase";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";
import { ISceneParams } from "../core/SceneParams";

export class CameraManager extends SceneBase {
    private _camera: THREE.PerspectiveCamera;
    private fakeCam: THREE.PerspectiveCamera;

    private camGlobalGroup: THREE.Group;
    private camLocalGroup: THREE.Group;
    private cameraTarget: THREE.Vector3;

    private shouldBeAt: THREE.Vector3;
    private swayShouldBeAt: THREE.Vector3;

    private direction: THREE.Vector3;
    private swayStrength: number;

    private _renderer: THREE.Renderer;
    private _controls: OrbitControls;

    constructor(parentScene: THREE.Scene, renderer: THREE.Renderer) {
        super(parentScene);
        this._renderer = renderer;
    }

    public initialize() {
        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        this._camera.position.set(0, 15, -0.001);
        this.cameraTarget = new THREE.Vector3(0, 15, 0);

        this.shouldBeAt = new THREE.Vector3(0, 0, 0);
        this.swayShouldBeAt = new THREE.Vector3(0, 15, 0);
        this.direction = new THREE.Vector3();
        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        this.direction.set(x!, y!, z!);

        this.camLocalGroup = new THREE.Group();
        this.camGlobalGroup = new THREE.Group();

        this.camLocalGroup.add(this._camera);
        this.camGlobalGroup.add(this.camLocalGroup);
        this._parentObject.add(this.camGlobalGroup);

        this.fakeCam = this._camera.clone();
        this._controls = new OrbitControls(this.fakeCam, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        this._controls.enableZoom = false;
        this._controls.enablePan = false;

        this._controls.target = this.cameraTarget;
        this._camera.copy(this.fakeCam);

        Globals.controls!.onStop(() => { 
            this.reset();
        });
    }


    private generatePath () {
        var curPos = new THREE.Vector3();

        this.directionalChanges.push(new THREE.Vector3(0,0,0));

        while (this.directionalChanges.length < Globals.currentSong.keyframes.length) {
            curPos = this.plot(curPos, 34);
        }

        console.log(this.directionalChanges);

    }

    private _buildRelElapsedTime = 0;

    private directionalChanges: THREE.Vector3[] = [];

    private kfGenClone = 1;

    public plot(curPos: THREE.Vector3, disLimit: number) {
        var keyframeArr = Globals.currentSong.keyframes;
        if (this.kfGenClone >= Globals.currentSong.keyframes.length) {
            return curPos;
        }
        var deltaTime = keyframeArr[this.kfGenClone].timestamp - this._buildRelElapsedTime;

        var kf = keyframeArr[this.kfGenClone - 1].sceneParams;
        kf = { ...Globals.sceneParams, ...kf };
        const { x, y, z } = kf.camera?.direction!;
        var direction = new THREE.Vector3(x!, y!, z!).normalize();

        var distance = (deltaTime / 1000) * kf.camera?.relativeSpeed! * 3;
        var dirChange = new THREE.Vector3().copy(curPos).addScaledVector(direction, distance);

        var destination = new THREE.Vector3().copy(curPos).addScaledVector(direction, disLimit);

        if (distance > disLimit) {
            this._buildRelElapsedTime +=
                disLimit / (0.003 * kf.camera?.relativeSpeed!);

            return destination;
        } else if (distance == disLimit) {
            if (this.kfGenClone < Globals.currentSong.keyframes.length) {
                this.kfGenClone++;
            }
            this._buildRelElapsedTime +=
                disLimit / (0.003 * kf.camera?.relativeSpeed!);
            return destination;
        } else {
            this.directionalChanges.push(dirChange);
            if (this.kfGenClone < Globals.currentSong.keyframes.length) {
                this.kfGenClone++;
            }
            this._buildRelElapsedTime += deltaTime;
            return this.plot(dirChange, disLimit - distance);
        }
    }

    private _kfIndex = 0;
    private distanceChecker = 0;
    private updateShouldBeAt (t) {
        var keyframeArr = Globals.currentSong.keyframes;

        var currentKf = this.directionalChanges[this._kfIndex];
        var nextKf;

        var kf = keyframeArr[this._kfIndex].sceneParams;
        kf = { ...Globals.sceneParams, ...kf };

        if (this._kfIndex + 1 >= this.directionalChanges.length) {
            nextKf = this.directionalChanges[this._kfIndex].add(new THREE.Vector3(0,0,100));
        } else {
            nextKf = this.directionalChanges[this._kfIndex + 1];
        }

        var distance = currentKf.distanceTo(nextKf);
        var direction = new THREE.Vector3().subVectors(nextKf, currentKf).normalize().multiplyScalar(t * kf.camera?.relativeSpeed! * 3);
        var origin = new THREE.Vector3();
        this.distanceChecker += origin.distanceTo(direction);
        this.shouldBeAt.add(direction);

        if (this.distanceChecker >= distance) {
            this.distanceChecker = 0;
            this._kfIndex++;
            console.log("changed direction at: " + this.testElapsedTime);
        }

    }

    public reset() {
        this._camera.position.set(0, 15, -0.001);
        this.cameraTarget.set(0, 15, 0);
        this.shouldBeAt.set(0, 0, 0);
        this.swayShouldBeAt.set(0, 15, 0);

        this.directionalChanges= [];
        this._buildRelElapsedTime = 0;
        this.kfGenClone = 1;
        this._kfIndex = 0;
        this.distanceChecker = 0;

        this.isPathGenerated = false;

        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        this.direction.set(x!, y!, z!);
    }

    getDirection() { return this.direction; }
    getCam() { return this._camera; }
    getCamGlobal() { return this.camGlobalGroup; }
    getCamSubParent() { return this.camLocalGroup; }

    private _prevTime = 0;
    private __direction = new THREE.Vector3();

    private testElapsedTime = 0;

    public songUpdate(elapsedTime: number) {
        this.testElapsedTime = elapsedTime;
        let deltaTime = elapsedTime - this._prevTime;
        if (deltaTime > 0) {
            let t = deltaTime / 1000;
            var r = elapsedTime / 1000;

            this.swayShouldBeAt.setX((Math.sin(r) / 4) * this.swayStrength);
            this.swayShouldBeAt.setY(15 + ((Math.cos(r * 2) / 2 + 0.5) * this.swayStrength));

            this.__direction.copy(this.direction);

            this.updateShouldBeAt(t);
        }
        this._prevTime = elapsedTime;
    }

    private updateClock = new THREE.Clock();

    private isPathGenerated = false;

    public update() {
        if (Globals.controls?._whoisReady["player"] && !this.isPathGenerated) {
            this.generatePath();
            this.isPathGenerated = true;
        }

        if (this.isPathGenerated) {
            let deltaTime = this.updateClock.getDelta();
            this.camGlobalGroup.position.lerp(this.shouldBeAt, deltaTime * 10);
            this.camLocalGroup.position.lerp(this.swayShouldBeAt, deltaTime * 10);
        }

        this._controls.update();
        this._camera.copy(this.fakeCam);
    }

    public _onParamsChanged(details: ISceneParams) {
        const { x, y, z } = details.camera?.direction!;
        this.direction.set(x!, y!, z!).normalize();
        this.swayStrength = details.camera?.sway!;
    }

    public resize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
    }
}
