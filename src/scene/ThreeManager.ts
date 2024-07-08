// Code taken from repo textalive-app-dance
import * as THREE from "three";
import Globals from "../core/Globals";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Skybox } from "./Skybox";
import { Buildings } from "./Buildings";
import { CameraManager } from "./CameraManager";
import { LyricsPlacer } from "./Lyrics";
import { FloorMng } from "./Floor";
import { Lights } from "./Lights";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

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
    public lights: Lights;

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

        this.initialize();
    }

    public initialize() {
        this._scene = new THREE.Scene();
        this._rootObj = new THREE.Group();
        this._scene.add(this._rootObj);

        this.camMng = new CameraManager(this._scene, this._renderer);
        this.camMng.initialize();
        this.camMng.resize();

        var skybox = new Skybox(this.camMng.getCamGlobal(), this._scene).initialize();
        var floor = new FloorMng(this.camMng.getCamGlobal()).initialize();

        var buildings = this.buildingsMng = new Buildings(this._rootObj, this.camMng);
        buildings.initialize();

        this.lyricsMng = new LyricsPlacer(this._rootObj, this.camMng);

        var lights = new Lights(this.camMng.getCamGlobal());
        lights.initialize();
        this.lights = lights;
        Globals.controls?.onStop(() => {
            this.reset();
        });

        let cam = this.camMng.getCam();
        this._composer.addPass(new RenderPass(this._scene, cam));

        Globals.controls!.setReady("scene", true);
        this._renderer.setAnimationLoop(this._update.bind(this));
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
    }

    public resize() {

        this.camMng.resize();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._composer.setSize(window.innerWidth, window.innerHeight);
    }

    public songUpdate(time: number) {
        // console.log("currentTime: " + Math.round(time));
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
        this.lights.update();

        this._composer.render();
    }

}
