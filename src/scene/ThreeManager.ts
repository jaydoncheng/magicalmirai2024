// Code taken from repo textalive-app-dance
import * as THREE from "three";
import { Building } from "./Building";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Globals from "../core/Globals";
import { SceneBuilder } from "./SceneBuilder";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { SceneBase } from "./SceneBase";
import { Skybox } from "./Skybox";
import { Buildings } from "./Buildings";
import { BuildingNew } from "./Buildingnew";

export class ThreeManager {
    private _view: HTMLElement;

    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private _controls;
    private _sceneBuilder: Buildings;

    private startingPos: THREE.Vector3;

    private camParent: THREE.Group;
    private camSubParent: THREE.Group; // takes the camera target into account
    private cameraTarget: THREE.Vector3;
    private camHelper: THREE.Vector3;
    private fakeCam: THREE.Camera;
    private direction: number;

    private textCanvas: HTMLCanvasElement;
    private textPlane: THREE.Mesh;

    private stats: Stats;

    private _rootObj : THREE.Group;
    private _objMngs : { [key: string] : SceneBase } = {};
    constructor() {
        Globals.controls!.setReady("scene", false);
        this._view = document.querySelector("#view")!;
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        this._view.appendChild(this._renderer.domElement);
        this.initialize();

        const _init = this.initialize.bind(this);
        window.addEventListener("songchanged", _init);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    public initialize() {
        this._scene = new THREE.Scene();
        this._rootObj = new THREE.Group();
        this._scene.add(this._rootObj);
        // ADD SCENE OBJECTS PARENTED TO ROOTOBJ

        var skybox = new Skybox(this._rootObj, this._scene);
        skybox.initialize();
        this._objMngs["skybox"] = skybox;

        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );


        this._camera.position.set(0, 1, -0.001);

        this.cameraTarget = new THREE.Vector3(0, 1, 0);
        // offset target to replicate first person
        this.camHelper = new THREE.Vector3();

        this.camSubParent = new THREE.Group();
        this.camParent = new THREE.Group();
        this.camSubParent.add(this._camera);
        this.camParent.add(this.camSubParent);

        this._scene.add(this.camParent);

        this.fakeCam = this._camera.clone();
        this._controls = new OrbitControls(this.fakeCam, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        this._controls.target = this.cameraTarget;
        this._controls.update;
        this._camera.copy(this.fakeCam);
        this.direction = 0;

        var colors = Globals.sceneParams.palette;

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // -------------------- this gotta be its own thing --------------------------------
        var buildings = this._sceneBuilder = new Buildings(this._rootObj);
        buildings.initialize();
        this._objMngs["buildings"] = buildings;

        this.startingPos = this._camera.position.clone();
        this.resize();

        Globals.controls!.setReady("scene", true);
        this._renderer.setAnimationLoop(this._update.bind(this));

        var alight = new THREE.AmbientLight(0x404040);
        this._scene.add(alight);
        var plight = new THREE.PointLight(0xffffff, 1, 100);
        plight.position.set(0, 10, 0);
        this._scene.add(plight);

        var genParams = {
                width: { val: 3, dev: 2 },
                height: { val: 8, dev: 8 },
                depth: { val: 3, dev: 2 },
                widthSegments: 1,
                heightSegments: 16,
                depthSegments: 1,
                twistFactor: { val: 1, dev: 10 }
        }
        var buildingnew = new BuildingNew(
            this._rootObj, { val: 4, dev: 1 }, { val: 2, dev: 2 }, { val: 4, dev: 1 },
            1, 1, 1, genParams);
        buildingnew._heightSegments = 1;
        this._objMngs["buildingnew"] = buildingnew;
        for (let i = 0; i < 10; i++) {
            var mesh = buildingnew.base({
                width: { val: 3, dev: 0.1 },
                height: { val: 8, dev: 8 },
                depth: { val: 3, dev: 0.1 },
                widthSegments: 1,
                heightSegments: 16,
                depthSegments: 1,
                twistFactor: { val: 1, dev: 10 }
        });
            mesh.position.set((4 * i) + (2 * i), 0, 0);
        }

        for (let i = 0; i < 10; i++) {
            var mesh = buildingnew.base({
                width: { val: 3, dev: 2 },
                height: { val: 8, dev: 8 },
                depth: { val: 3, dev: 2 },
                widthSegments: 1,
                heightSegments: 16,
                depthSegments: 1,
                twistFactor: { val: 0, dev: 0 }
        });
            mesh.position.set((4 * i) + Math.random() * 5 - 10, 0, 50);
        }
    }

    public setDirection(degrees: number) {
        this.direction = degrees;
    }

    public resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public drawText(text: string) {
        var ctx = this.textCanvas.getContext("2d")!;
        var canvas = this.textCanvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        var texture = new THREE.CanvasTexture(canvas);
        // this.textPlane.material.dispose();
        this.textPlane.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        this.textPlane.position.x = (-canvas.width * 0.02) / 2;
        // this.cameraTarget = this.textPlane.position.clone();
    }

    private shouldBeAt = new THREE.Vector3();
    private directionVector = new THREE.Vector3();
    private started = false;
    public update(time: number) {
        this.started = true;
        var t = time / 1000;
        // this.shouldBeAt.z = time / 100;
        this.camSubParent.position.x = Math.sin(t) / 4;
        this.camSubParent.position.y = Math.cos(t * 2) / 2 + 0.5;

        this.textPlane.position.copy(this.camParent.position);
        this.textPlane.position.z += 7;
        this.textPlane.position.x = -Math.sin(t) / 2;
        this.textPlane.lookAt(this._camera.position);

        let deg = (this.direction * Math.PI) / 180;

        this.directionVector.set(Math.sin(deg), 0, Math.cos(deg));

        this.shouldBeAt.copy(this.camParent.position);
        this.shouldBeAt.add(this.directionVector);
    }

    private _clock = new THREE.Clock();
    private prevPos = new THREE.Vector3(0, 0, 0);
    private _x = new THREE.Vector3();
    private buildCount = 0;
    public _update() {
        if (this.prevPos.distanceTo(this.shouldBeAt) > 2) {
            this._sceneBuilder.populate(this.camParent.position, this.shouldBeAt);
            this.prevPos.copy(this.camParent.position);
            this.buildCount++;
            // if (this.buildCount >= 15) {
            //     this._sceneBuilder.deleteBlock();
            // }
        }

        document.querySelector("#debug")!.innerHTML = `x: ${this.camParent.position.x.toFixed(2)}, y: ${this.camParent.position.y.toFixed(2)}, z: ${this.camParent.position.z.toFixed(2)}`;
        document.querySelector("#debug")!.innerHTML += `x: ${this.shouldBeAt.x.toFixed(2)}, y: ${this.shouldBeAt.y.toFixed(2)}, z: ${this.shouldBeAt.z.toFixed(2)}`;

        if (this.started) {
            this.camParent.position.lerp(
                this.shouldBeAt,
                this._clock.getDelta() * 10,
            );
        }

        this._camera.getWorldPosition(this._x);
        this._camera.copy(this.fakeCam);
        this._camera.getWorldPosition(this._x);
        this.stats.update();

        this._renderer.render(this._scene, this._camera);
    }

    public addBuilding(building: Building) {
        this._scene.add(building.buildingBox);
    }

    // params currently kinda useless
    public _onParamsChanged(params: any) {
        for (let objMng of Object.values(this._objMngs)) {
            objMng._onParamsChanged(params);
        }
    }
        
}
