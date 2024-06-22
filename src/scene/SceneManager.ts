// Code taken from repo textalive-app-dance
import * as THREE from "three";
import { Building } from "./Building";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";

export class SceneManager {
    // TODO: ok so
    // scene initialization and populating the scene with objects should
    // probably be done separately, since building prefabs need to be
    // fetched, loaded, etc.
    //
    // this class will then be responsible for:
    // - initializing the renderer and scene,
    // - calling the whatever function/class/system that will populate the scene
    // - handle the song change events n shit and pass it downstream
    // - post processing
    // and probably a bunch of other misc shit
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private _controls;
    private _plight: THREE.PointLight;

    constructor() {
        this._view = document.querySelector("#view")!;
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setAnimationLoop(this.update.bind(this));

        this._view.appendChild(this._renderer.domElement);
        this.initialize();

        const _init = this.initialize.bind(this);
        window.addEventListener("songchanged", _init);
    }

    public initialize() {
        this._scene = new THREE.Scene({
            antialias: true,
        });
        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        console.log(Globals.currentSong);
        var { colors } = Globals.currentSong.keyframes["0"];

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this._scene.background = new THREE.Color(colors.sky);
        const fog = new THREE.Fog(colors.fog, 0.015, 100);
        this._scene.fog = fog;

        const alight = new THREE.AmbientLight(colors.ambientLight, 0.8);
        alight.position.set(0, 1, 0);
        this._scene.add(alight);

        var plight = this._plight = new THREE.PointLight(colors.pointLight, 1, 50, 5);
        plight.position.set(0, 5, 0);
        plight.castShadow = true;
        this._scene.add(plight);

        const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: colors.plane,
            side: THREE.FrontSide,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.scale.set(32, 3200, 1);
        plane.receiveShadow = true;
        plane.castShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);

        for (let i = 0; i < 1000; i++) {
            const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
            const boxMaterial = new THREE.MeshPhongMaterial({ color: colors.box });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            var x = Math.random() * 20 - 10;
            var z = Math.random() * 300;
            if (x > -1 && x < 1) {
                x = x > 0 ? 1 : -1;
                box.material.color.setHex(0xff0000);
            }
            box.scale.set(1, 1 + Math.random() * 8, 1);
            box.position.set(x, 0.5, -z + 10);
            box.castShadow = true;
            box.receiveShadow = true;
            this._scene.add(box);
        }

        this._camera.position.z = 5;
        this._camera.position.y = 1.5;
        this.resize();
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public update() {
        this._camera.position.z -= 0.001;
        this._camera.lookAt(0, 1, this._camera.position.z - 5);
        // this._plight.position.z = this._camera.position.z - 10;
        this._renderer.render(this._scene, this._camera);
        this._controls.update();
    }

    public addBuilding(building: Building) {
        this._scene.add(building.buildingBox);
    }
}
