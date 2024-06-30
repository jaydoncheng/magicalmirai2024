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

  private nextPos: THREE.Vector3;
  private shouldBeAt: THREE.Vector3;

  private framerate: number;
  private frameInterval: number;

  private prevTime: number;
  private deltaTime: number;
  private pathPercent: number;

  constructor(parentScene: THREE.Scene, renderer: THREE.Renderer) {
    super(parentScene);
    this._renderer = renderer;
    this.framerate = 60;
    this.frameInterval = 1000 / this.framerate;
    this.prevTime = 0;
    this.deltaTime = 0;
    this.pathPercent = 0;
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

    this.nextPos = new THREE.Vector3(0, 0, 0);
    this.shouldBeAt = new THREE.Vector3(0, 0, 0);

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

  public getDirectVector() {
    return this.direction;
  }

  public position() {
    return this.worldLoc;
  }

  public getCam() {
    return this._camera;
  }

  public getCamParent() {
    return this.camParent;
  }

  public reset() {
    this.nextPos.set(0, 0, 0);
    this.shouldBeAt.set(0, 0, 0);
  }

  public getCamSubParent() {
    return this.camSubParent;
  }

  private _clock = new THREE.Clock();

  private atEnd = false;

  public songUpdate(time: number) {
    this.shouldBeAt.lerp(this.nextPos, this.pathPercent);

    if (this.pathPercent >= 1) {
      this.atEnd = true;
      this.getDirection(Globals.sceneParams.camera.direction);
      if (this.buildFunction) {
        this.buildFunction();
      }
      this.pathPercent = 0;
      this.nextPos.add(this.direction);
      return;
    }
    this.atEnd = false;
  }

  private buildFunction: Function;

  public setBuildFunc(fnc: Function) {
    this.buildFunction = fnc;
  }

  public isAtEnd() {
    return this.atEnd;
  }

  public update() {
    this.camParent.position.lerp(this.shouldBeAt, this._clock.getDelta() * 10);

    this._controls.update;
    this._camera.copy(this.fakeCam);
    this._camera.getWorldPosition(this.worldLoc);
    this._controls.update;

    document.querySelector("#debug")!.innerHTML =
      `x: ${this.camParent.position.x.toFixed(2)}, y: ${this.camParent.position.y.toFixed(2)}, z: ${this.camParent.position.z.toFixed(2)}`;
    document.querySelector("#debug")!.innerHTML +=
      `x: ${this.shouldBeAt.x.toFixed(2)}, y: ${this.shouldBeAt.y.toFixed(2)}, z: ${this.shouldBeAt.z.toFixed(2)}`;
    document.querySelector("#debug")!.innerHTML +=
      `x: ${this.nextPos.x.toFixed(2)}, y: ${this.nextPos.y.toFixed(2)}, z: ${this.nextPos.z.toFixed(2)}`;

    this.animate(Date.now());
  }

  public _onParamsChanged(params) {}

  public getPathPercent() {
    return this.pathPercent;
  }

  public animate(currTime) {
    this.deltaTime = currTime - this.prevTime;
    this.prevTime = currTime;

    this.pathPercent +=
      (Globals.sceneParams.camera.relativeSpeed / 10) *
      (this.deltaTime / this.frameInterval);
  }
}
