// Code taken from repo textalive-app-dance
import * as THREE from "three";

export class SceneManager {
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private geometry = new THREE.BoxGeometry(1, 1, 1);
    private material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    private cube = new THREE.Mesh(this.geometry, this.material);

    constructor() {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        this._renderer = new THREE.WebGLRenderer();
        this.resize();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);

        document.body.appendChild(this._renderer.domElement);

        this._scene.add(this.cube);
        this._camera.position.z = 5;
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public update() {
        requestAnimationFrame(this.update);
        this.cube.rotation.x += 1;
        this.cube.rotation.y += 1;
        this._renderer.render(this._scene, this._camera);
    }

    public rotate() {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
    }

    public updateTest() {
        this._renderer.setAnimationLoop(this.update);
    }
}
