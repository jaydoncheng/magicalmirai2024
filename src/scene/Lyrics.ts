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


    private _pos = new THREE.Vector3();
    public shootRay(maxDist : number) : THREE.Intersection | null {
        this._ray.far = maxDist;
        this._ray.near = 0;
        
        this._camMng.getCamSubParent().getWorldPosition(this._pos);
        this._pos.addScaledVector(this.__direction, 0.1);

        var r = this._randomPointOnScreen();
        this._ray.setFromCamera(r, this._camMng.getCam());
        this._ray.ray.origin.copy(this._pos);

        var children = this._parentObject.children;
        // only keep Group objects
        children = children.filter((c) => c.type == "Group");

        var hit = this._ray.intersectObjects(children, true);
        for (let h of hit) {
            if (h.object.type == "Mesh") {
                return h;
            }
        }

        return null
    }

    public initialize() {}

    private _word : CharTexMapType = {};
    public placeWord(word: CharTexMapType) {
        var hit : THREE.Intersection | null = null;
        hit = this.shootRay(100);

        var pos = hit.point;
        var norm = hit.face!.normal;
        var parent_rot = hit.object.parent.rotation;
    }

    public placeChar(c: CharTex) {

    }

    public placeLyrics(p: CharTexMapType) {
        console.log("placing lyrics");
        console.log(p);

        var hit : THREE.Intersection | null = null;
        hit = this.shootRay(100);

        var pos = hit.point;
        var norm = hit.face!.normal;
        var parent_rot = hit.object.parent.rotation;

        var keys = Object.keys(p);
        for (var i = 0; i < keys.length; i++) {
            var c : CharTex = p[keys[i]];

            c._plane.position.copy(pos);
            c._plane.position.addScaledVector(norm, 0.1);
            c._plane.position.setY(c._plane.position.y - i * 5.5);
            var l = new THREE.Vector3();
            l.addVectors(c._plane.position, norm);
            c._plane.scale.set(5, 5, 5);
            c._plane.lookAt(l);
            c._plane.rotateY(parent_rot.y);
            this._parentObject.add(c._plane);
            console.log("placed", c, pos, norm, hit);
        }
    }

    public update() {
    }

    public _onParamsChanged(details : ISceneParams) {
        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        this.__direction.set(x!, y!, z!);
    }
}
