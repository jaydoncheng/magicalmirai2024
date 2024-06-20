// Code taken from repo textalive-app-dance
import * as THREE from 'three'

export class SceneManager {

    private _view : HTMLElement;

    private _renderer : THREE.Renderer;
    private _scene : THREE.Scene;
    private _camera : THREE.Camera;

    constructor () {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this._renderer = new THREE.WebGLRenderer();
        this.resize();

        document.body.appendChild(this._renderer.domElement)
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight)
    }

    public update() {
        this._renderer.render(this._scene, this._camera);
    }
}
