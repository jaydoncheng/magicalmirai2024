import * as THREE from 'three';
import Globals from '../core/Globals';
import { ISceneParams } from '../core/SceneParams';
import { CharTex, CharTexMapType } from '../player/CharTex';
import { CameraManager } from './CameraManager';
import { SceneBase } from "./SceneBase";

export class LyricsPlacer extends SceneBase {

    private _ray: THREE.Raycaster;
    private _camMng : CameraManager;
    constructor(_parentObject: THREE.Object3D, _cam : CameraManager) {
        super(_parentObject);

        this._camMng = _cam;
        this._ray = new THREE.Raycaster();
    }

    private _u = new THREE.Vector3();
    private _randomDirection(b: THREE.Vector3, t: number = Math.PI / 2) {
        b.normalize();

        this._u.copy(b);
        this._u.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * t - t / 2);
        this._u.setY(Math.random() * 1 - 0.5);
        this._u.normalize();

        return this._u;
    }

    private _pos = new THREE.Vector3();
    public shootRay(direction: THREE.Vector3, t : number = Math.PI / 2, maxDist : number = 80) : THREE.Intersection | null {
        var randdirection = this._randomDirection(direction, t);
        
        this._camMng.getCamSubParent().getWorldPosition(this._pos);
        console.log(this._pos);
        this._ray.set(this._pos, randdirection);
        this._ray.far = maxDist;
        this._ray.near = 0;

        // var rayPos = new THREE.Vector3();
        // this._ray.ray.at(50, rayPos);
        // var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // var geometry = new THREE.BufferGeometry()
        // geometry.setFromPoints([this._parentObject.position, rayPos]);
        // var m = new THREE.Line(geometry, material);
        // this._parentObject.add(m);

        for (const c of this._parentObject.children) {
            if (c.type === "Group") {
                var hit = this._ray.intersectObjects(c.children, true);
                return hit[0]
            }
        }
        return null;
    }

    public initialize() {}

    public newCameraTarget() {
        console.log("new camera target");
        var hit : THREE.Intersection | null = null;
        do {
            console.log("shooting ray");
            console.log(this._camMng.getDirection());
            hit = this.shootRay(this._camMng.getDirection(), 3 / 2 * Math.PI);
        } while (!hit);
        console.log(hit.point);
        this._camMng.setTarget(hit.point);
    }

    public placeLyrics(p: CharTexMapType) {
        console.log("placing lyrics");
        console.log(p);

        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        const d = new THREE.Vector3(x, y, z);
        var hit : THREE.Intersection | null = null;
        var count = 0;
        do {
            hit = this.shootRay(d);
            count++;
        } while (!hit && count < 10);

        var keys = Object.keys(p);
        var pos = hit.point;
        var norm = hit.face!.normal;
        for (var i = 0; i < keys.length; i++) {
            var c : CharTex = p[keys[i]];

            c._plane.position.copy(pos);
            c._plane.position.addScaledVector(norm, 0.1);
            c._plane.position.setY(c._plane.position.y - i * 1.5);
            var l = new THREE.Vector3();
            l.addVectors(c._plane.position, norm);
            c._plane.scale.set(5, 5, 5);
            c._plane.lookAt(l);
            console.log(norm);
            console.log(c._plane.rotation.x, c._plane.rotation.y, c._plane.rotation.z);
            this._parentObject.add(c._plane);
            console.log("placed", c);
        }
    }

    public update() {
    }

    public _onParamsChanged(details : ISceneParams) {
    }
}
