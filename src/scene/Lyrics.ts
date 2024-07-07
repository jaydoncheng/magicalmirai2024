import * as THREE from 'three';
import Globals from '../core/Globals';
import { ISceneParams } from '../core/SceneParams';
import { CharTex, CharTexMapType } from '../player/CharTex';
import { CameraManager } from './CameraManager';
import { SceneBase } from "./SceneBase";

export class LyricsPlacer extends SceneBase {

    private _ray: THREE.Raycaster;
    private _camMng : CameraManager;

    private __direction: THREE.Vector3 = new THREE.Vector3();
    constructor(_parentObject: THREE.Object3D, _cam : CameraManager) {
        super(_parentObject);

        this._camMng = _cam;
        this._ray = new THREE.Raycaster();
        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        this.__direction.set(x!, y!, z!);
    }

    private _p = new THREE.Vector2();
    private _randomPointOnScreen() {
        var x = Math.random() * 1 - 0.5;
        var y = Math.random() * 1 - 0.5;
        this._p.set(x, -y);

        return this._p;
    }

    private _u = new THREE.Vector3();
    private _randomDirection(baseDir: THREE.Vector3, maxAngle: number) {
        this._u.copy(baseDir);
        this._u.normalize();

        this._u.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * maxAngle - maxAngle / 2);
        this._u.setY(Math.random() * 0.2 - 0.1);
        this._u.normalize();

        return this._u;
    }


    private _pos = new THREE.Vector3();
    private _rot = new THREE.Vector3();
    public shootRay(maxDist : number) : THREE.Intersection | null {
        this._ray.far = maxDist;
        this._ray.near = 0;
        
        this._camMng.getCamSubParent().getWorldPosition(this._pos);
        this._pos.addScaledVector(this.__direction, Globals.sceneParams.camera?.relativeSpeed! * 0.1);
        this._camMng.getCam().getWorldDirection(this._rot);

        var dir = this._randomDirection(this._rot, Math.PI / 4);
        this._ray.set(this._pos, dir);
        console.log(this._pos, dir);

        var children = this._parentObject.children;
        // only keep Group objects
        children = children.filter((c) => c.type == "Group");

        var hit = this._ray.intersectObjects(children, true);
        for (let h of hit) {
            if (h.object.type == "Mesh") {
                return h;
            }
        }

        return this.shootRay(maxDist);
    }

    public initialize() {}

    private _placeWordAt : any;
    private _wordMap : CharTexMapType = {};
    public placeWord(word: CharTexMapType) {
        var hit : THREE.Intersection | null = null;
        hit = this.shootRay(100);
        this._placeWordAt = hit;
        this._wordMap = word;
    }

    private _scale = 4;
    public placeChar(c: CharTex) {
        var pos = this._placeWordAt.point;
        var norm = this._placeWordAt.face!.normal;
        var parent_rot = this._placeWordAt.object.parent.rotation;
        var i = this._wordMap[c._char]._index;

        c._plane.position.copy(pos);
        c._plane.rotateY(parent_rot.y);
        c._plane.position.addScaledVector(norm, 0.1);
        c._plane.position.setY(c._plane.position.y - i * (this._scale + 0.5));
        var l = new THREE.Vector3();
        l.addVectors(c._plane.position, norm);
        c._plane.scale.set(this._scale, this._scale, this._scale);
        c._plane.lookAt(l);
        this._parentObject.add(c._plane);
    }

    public update() {}

    public _onParamsChanged(details : ISceneParams) {
        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        this.__direction.set(x!, y!, z!);
    }
}
