// Code taken from repo textalive-app-dance
import * as THREE from "three";
import { Building } from "./Building";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

export class SceneManager {
    // TODO: ok so
    // scene initialization and populating the scene with objects should
    // probably be done separately, since building prefabs need to be
    // fetched, loaded, etc.
    //
    // this class will then be responsible for:
    // - initializing the renderer and scene,
    // - calling the whatever function/class/system that will populate the scene
    //      - additionally this whatever will probably also handle lighting?
    // - handle the song change events n shit and pass it downstream
    // - post processing
    // and probably a bunch of other misc shit. it needs to expose a
    // small API to PlayerManager which lets PM update elements in the
    // scenes as well as control camera n shit
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private _controls;
    private _plight: THREE.PointLight;

    constructor() {
        Globals.controls!.setReady('scene', false);
        this._view = document.querySelector("#view")!;
        this._renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        // this._renderer.setAnimationLoop(this.update.bind(this));

        this._view.appendChild(this._renderer.domElement);
        this.initialize();

        const _init = this.initialize.bind(this);
        window.addEventListener("songchanged", _init);
    }

    public initialize() {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        var { colors } = Globals.currentSong.keyframes["0"];

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this._scene.background = new THREE.Color(colors.sky);
        const fog = new THREE.Fog(colors.fog, 0.015, 100);
        this._scene.fog = fog;

        const alight = new THREE.AmbientLight(colors.ambientLight, 0.1);
        alight.position.set(0, 1, 0);
        this._scene.add(alight);

        var plight = this._plight = new THREE.PointLight(colors.pointLight, 1, 50, 5);
        plight.position.set(0, 5, 0);
        plight.castShadow = true;
        plight.shadow.bias = 0.00001;
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

        Globals.controls!.setReady('scene', true);
        this._renderer.setAnimationLoop(this._update.bind(this));

        this.addText("hello", 0, 0, 0);

    }

    public addText(text: string, x: number, y: number, z: number) {
        const loader = new FontLoader();
        // i wish u best of luck, parcel doesnt handle json files very well
        // and needs them copied as a static asset
        // https://discourse.threejs.org/t/unable-to-use-fontloader-or-textgeometry/35803
        // ill go look later
        loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
            const geometry = new TextGeometry(text, {
                font: font,
                size: 0.1,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            this._scene.add(mesh);
        });
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public update(time: number) {
        this._camera.position.z = -time / 1000;
    }

    private _clock = new THREE.Clock();
    public _update() {
        this._camera.position.z -= 0.1 * this._clock.getDelta();
        this._camera.lookAt(0, 1, this._camera.position.z - 5);
        // this._plight.position.z = this._camera.position.z - 10;
        this._renderer.render(this._scene, this._camera);
        this._controls.update();
    }

    public addBuilding(building: Building) {
        this._scene.add(building.buildingBox);
    }
}
