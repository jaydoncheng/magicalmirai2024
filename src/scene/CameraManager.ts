import * as THREE from "three";
import { SceneBase } from "./SceneBase";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";

export class CameraManager extends SceneBase {
  private _camera: THREE.Camera;
  private fakeCam: THREE.Camera;
  private camParent: THREE.Group;
  private camSubParent: THREE.Group; // takes the camera target into account
  private cameraTarget: THREE.Vector3;
  private direction: THREE.Vector3;

  private _renderer: THREE.Renderer;
  private _controls: OrbitControls;
  private worldLoc: THREE.Vector3;

  private startingPos: THREE.Vector3;
  private shouldBeAt: THREE.Vector3;

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

    this.startingPos = new THREE.Vector3(0, 0, 0);
    this.shouldBeAt = new THREE.Vector3(0, 0, 2);

    this.cameraTarget = new THREE.Vector3(0, 1, 0);
    // offset target to replicate first person

    this.camSubParent = new THREE.Group();
    this.camParent = new THREE.Group();
    this.camSubParent.add(this._camera);
    this.camParent.add(this.camSubParent);
    this._parentObject.add(this.camParent);
    this.worldLoc = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.fakeCam = this._camera.clone();
    this._controls = new OrbitControls(this.fakeCam, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.25;

    this._controls.target = this.cameraTarget;
    this._controls.update;
    this._camera.copy(this.fakeCam);
  }

  public thing() {}

  public add(child) {
    this.camParent.add(child);
  }

  public getDirection(direcVec) {
    this.direction.setX(direcVec.x);
    this.direction.setY(direcVec.y);
    this.direction.setZ(direcVec.z);
  }

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

  public reset() {
    this.startingPos.set(0, 0, 0);
    this.shouldBeAt.copy(this.direction);
  }

  public getCamSubParent() {
    return this.camSubParent;
  }

  private _clock = new THREE.Clock();

  public songUpdate(time: number) {
    if (time % 1000) {
      this.shouldBeAt.add(
        this.direction.multiplyScalar(Globals.sceneParams.camera.relativeSpeed),
      );
    }
  }

  public update() {
    this.getDirection(Globals.sceneParams.camera.direction);

    if (this.hasStarted) {
      this.camParent.position.lerp(
        this.shouldBeAt,
        this._clock.getDelta() * 10,
      );
    }

    this._controls.update;
    this._camera.copy(this.fakeCam);
    this._camera.getWorldPosition(this.worldLoc);
    this._controls.update;
  }

  public _onParamsChanged(params) {}

  private hasStarted = false;

  public started(bool: boolean) {
    this.hasStarted = bool;
  }

  private prevTime = 0;
  public animate(currTime) {
    let deltaTime = currTime - this.prevTime;
    this.prevTime = currTime;

    requestAnimationFrame(this.animate);
  }
}
