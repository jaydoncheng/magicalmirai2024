import * as THREE from 'three';
import Globals from '../core/Globals';
import { ISceneParams } from '../core/SceneParams';
import { CharTex, CharTexMapType } from '../player/CharTex';
import { CameraManager } from './CameraManager';
import { SceneBase } from "./SceneBase";

export class LyricsPlacer extends SceneBase {

    private _ray: THREE.Raycaster;
    private _camMng: CameraManager;

    private _objs: THREE.Object3D[] = [];

    private __direction: THREE.Vector3 = new THREE.Vector3();
    constructor(_parentObject: THREE.Object3D, _cam: CameraManager) {
        super(_parentObject);

        this._camMng = _cam;
        this._ray = new THREE.Raycaster();
        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        this.__direction.set(x!, y!, z!);

        Globals.controls?.onStop(() => {
            this._objs.forEach((o) => {
                this._parentObject.remove(o);
            });
            this._objs = [];
        });
    }

    private _u = new THREE.Vector3();
    private _randomDirection(baseDir: THREE.Vector3, maxAngle: number) {
        this._u.copy(baseDir);
        this._u.normalize();

        this._u.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * maxAngle - maxAngle / 2);
        this._u.setY(Math.random() * 0.4);
        this._u.normalize();

        return this._u;
    }

    private _pos = new THREE.Vector3();
    private _rot = new THREE.Vector3();
    public shootRay(maxDist: number): THREE.Intersection | null {
        this._ray.far = maxDist;
        this._ray.near = 0;

        this._camMng.getCamSubParent().getWorldPosition(this._pos);
        this._pos.addScaledVector(this.__direction, Globals.sceneParams.camera?.relativeSpeed! * 1.2);
        this._camMng.getCam().getWorldDirection(this._rot);

        var dir = this._randomDirection(this._rot, Math.PI / 2);
        this._ray.set(this._pos, dir);

        var children = this._parentObject.children;
        // only keep Group objects
        children = children.filter((c) => c.type == "Group");

        var hit = this._ray.intersectObjects(children, true);
        for (let h of hit) {
            if (h.object.type == "Mesh") {
                return h;
            }
        }

        return this.shootRay(maxDist * 1.5);
    }

    public initialize() { }

    private _placeWordAt: any;
    private _wordMap: CharTexMapType = {};
    public placeWord(word: CharTexMapType) {
        var hit: THREE.Intersection | null = null;
        hit = this.shootRay(60);
        this._placeWordAt = hit;
        this._wordMap = word;
    }

    private _scale = 4;
    private _la : THREE.Vector3 = new THREE.Vector3();
    private _poi : THREE.Vector3 = new THREE.Vector3();
    private _n : THREE.Vector3 = new THREE.Vector3();
    public placeChar(c: CharTex) {

        this._poi.copy(this._placeWordAt.point);
        this._n.copy(this._placeWordAt.face.normal);
        this._n.transformDirection(this._placeWordAt.object.matrixWorld);
        this._la.copy(this._poi).addScaledVector(this._n, 2);

        var i = this._wordMap[c._char]._index;

        c._plane.position.copy(this._poi);
        c._plane.position.addScaledVector(this._n, 1.05)
        c._plane.lookAt(this._la);
        c._plane.position.setY(c._plane.position.y - i * (this._scale + 0.5));
        c._plane.scale.set(this._scale, this._scale, this._scale);

        this._parentObject.add(c._plane);
        this._objs.push(c._plane);
    }

    public update() { }

    public _onParamsChanged(details: ISceneParams) {
        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        this.__direction.set(x!, y!, z!);
    }
}
