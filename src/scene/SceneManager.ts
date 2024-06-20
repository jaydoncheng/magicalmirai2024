// Code taken from repo textalive-app-dance
import * as THREE from "three";
import { Building } from "./Building";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class SceneManager {
  private _view: HTMLElement;

  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera: THREE.Camera;
  // private geometry = new THREE.BoxGeometry(1, 1, 1);
  // private material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // private cube = new THREE.Mesh(this.geometry, this.material);

  constructor() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this._renderer = new THREE.WebGLRenderer();

    const light = new THREE.AmbientLight(0x202020);
    this._scene.add(light);

    const plight = new THREE.PointLight(0xffffff, 10, 100);
    plight.position.set(0, 2, 0);
    plight.castShadow = true;
    this._scene.add(plight);

    const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = Math.PI / 2;
    this._scene.add(plane);

    this.resize();
    // this.geometry = new THREE.BoxGeometry(1, 1, 1);
    // this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // this.cube = new THREE.Mesh(this.geometry, this.material);

    document.body.appendChild(this._renderer.domElement);

    // this._scene.add(this.cube);
    this._camera.position.z = 5;
    this._camera.position.y = 1;

    const controls = new OrbitControls(this._camera, this._renderer.domElement);
    controls.update();
  }

  public resize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public update() {
    this.rotate();
    this._renderer.render(this._scene, this._camera);
  }

  public rotate() {
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
  }

  public updateTest() {
    this.update = this.update.bind(this);
    this._renderer.setAnimationLoop(this.update);
  }

  public addBuilding(building: Building) {
    this._scene.add(building.buildingBox);
  }
}
