// Code taken from repo textalive-app-dance
import * as THREE from "three";
import Globals from "../core/Globals";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Skybox } from "./Skybox";
import { Buildings } from "./Buildings";
import { CameraManager } from "./CameraManager";
import { LyricsPlacer } from "./Lyrics";
import { FloorMng } from "./Floor";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

export class ThreeManager {
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _rootObj: THREE.Group;
    private _composer: EffectComposer;

    // Scene Base Objects
    public buildingsMng: Buildings;
    public camMng: CameraManager;
    public skyboxMng: Skybox;
    public lyricsMng: LyricsPlacer;

    private stats: Stats;

    constructor() {
        Globals.controls!.setReady("scene", false);
        this._view = document.querySelector("#view")!;
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._composer = new EffectComposer(this._renderer);
        this._view.appendChild(this._renderer.domElement);

        const _init = this.initialize.bind(this);
        window.addEventListener("songchanged", _init);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // TODO: fix this
        let interval = setInterval(() => {
            console.log("waiting for textures");
            if (Globals.textures!.isReady) {
                console.log("textures ready in threemanager");
                clearInterval(interval);
                this.initialize();
            }
        }, 800);
    }

    public initialize() {
        this._scene = new THREE.Scene();
        this._rootObj = new THREE.Group();
        this._scene.add(this._rootObj);

        this.camMng = new CameraManager(this._scene, this._renderer);
        this.camMng.initialize();

        var skybox = new Skybox(this.camMng.getCamGlobal(), this._scene).initialize();
        var floor = new FloorMng(this.camMng.getCamGlobal()).initialize();

        var buildings = this.buildingsMng = new Buildings(this._rootObj, this.camMng);
        buildings.initialize();

        this.lyricsMng = new LyricsPlacer(this._rootObj, this.camMng);

        var alight = new THREE.AmbientLight(0x404040);
        this._scene.add(alight);
        var dlight = new THREE.DirectionalLight(0xffffff, 1);
        dlight.position.set(0, 100, 100);
        dlight.castShadow = true;
        this._rootObj.add(dlight);

        Globals.controls?.onStop(() => {
            this.reset();
        });

        let cam = this.camMng.getCam();
        this._composer.addPass(new RenderPass(this._scene, cam));

        Globals.controls!.setReady("scene", true);
        this._renderer.setAnimationLoop(this._update.bind(this));
        this.resize();
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._composer.setSize(window.innerWidth, window.innerHeight);
        this.camMng.resize();
    }

    public songUpdate(time: number) {
        this.camMng.songUpdate(time);
        this.buildingsMng.songUpdate(time);
    }

    public reset() {
        this.buildingsMng.setKeyframeIndex(1);
    }

    public _update() {

        this.stats.update();
        this.camMng.update();
        this.buildingsMng.update();

        this._composer.render();
    }

}
