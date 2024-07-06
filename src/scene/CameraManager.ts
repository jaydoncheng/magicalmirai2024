import * as THREE from "three";
import { SceneBase } from "./SceneBase";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";

export class CameraManager extends SceneBase {
  private _camera: THREE.Camera;
  private fakeCam: THREE.Camera;

  private camGlobalGroup: THREE.Group;
  private camLocalGroup: THREE.Group;
  private cameraTarget: THREE.Vector3;

  private shouldBeAt: THREE.Vector3;
  private swayShouldBeAt: THREE.Vector3;

  private direction: THREE.Vector3;

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

    this._camera.position.set(0, 10, -0.001);
    this.cameraTarget = new THREE.Vector3(0, 10, 0);

    this.shouldBeAt = new THREE.Vector3(0, 0, 0);
    this.swayShouldBeAt = new THREE.Vector3(0, 10, 0);
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

    // this._controls.enableZoom = false;
    // this._controls.enablePan = false;

    this._controls.target = this.cameraTarget;
    this._controls.update;
    this._camera.copy(this.fakeCam);

    Globals.controls!.onStop(() => {
      this.reset();
    });
  }

  public add(child) {
    this.camGlobalGroup.add(child);
  }

  public setDirection(direction) {
    this.direction.setX(direction.x);
    this.direction.setY(direction.y);
    this.direction.setZ(direction.z);
    this.direction.normalize();
  }

  public getDirectVector() {
    return this.direction;
  }

  public getCam() {
    return this._camera;
  }

  public getCamGlobal() {
    return this.camGlobalGroup;
  }

  public reset() {
    this.shouldBeAt.set(0, 0, 0);
  }

  public getCamSubParent() {
    return this.camLocalGroup;
  }

  private songClock = new THREE.Clock();

  private _prevTime = 0;
  public songUpdate(elapsedTime: number) {
    let deltaTime = elapsedTime - this._prevTime;
    if (deltaTime > 0) {
      let t = deltaTime / 1000;
      var r = elapsedTime / 1000;
      console.log("time: ", t, elapsedTime);

      this.swayShouldBeAt.setX(Math.sin(r) / 4);
      this.swayShouldBeAt.setY(25 + (Math.cos(r * 2) / 2 + 0.5));

      const { x, y, z } = Globals.sceneParams.camera?.direction!;
      this.direction.set(x!, y!, z!).normalize();

      this.shouldBeAt.add(
        this.direction.multiplyScalar(
          t * Globals.sceneParams.camera?.relativeSpeed * 3,
        ),
      );
    }
    this._prevTime = elapsedTime;
  }

  private updateClock = new THREE.Clock();

  public update() {
    let deltaTime = this.updateClock.getDelta();
    this.camGlobalGroup.position.lerp(this.shouldBeAt, deltaTime * 10);
    this.camLocalGroup.position.lerp(this.swayShouldBeAt, deltaTime * 10);

    this._controls.update;
    this._camera.copy(this.fakeCam);

    document.querySelector("#debug")!.innerHTML =
      `x: ${this.camGlobalGroup.position.x.toFixed(2)}, y: ${this.camGlobalGroup.position.y.toFixed(2)}, z: ${this.camGlobalGroup.position.z.toFixed(2)}`;
    document.querySelector("#debug")!.innerHTML +=
      `x: ${this.shouldBeAt.x.toFixed(2)}, y: ${this.shouldBeAt.y.toFixed(2)}, z: ${this.shouldBeAt.z.toFixed(2)}`;
  }

  public _onParamsChanged() {
    console.log("camera params changed");
  }
}
