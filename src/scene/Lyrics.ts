import * as THREE from 'three';
import Globals from '../core/Globals';
import { CharTex, CharTexMapType } from '../player/CharTex';
import { SceneBase } from "./SceneBase";
// import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';

export class LyricsPlacer extends SceneBase {

    private _ray: THREE.Raycaster;
    private _camGlobal : THREE.Group;
    constructor(_parentObject: THREE.Object3D, _camGlobal : THREE.Group) {
        super(_parentObject);

        this._camGlobal = _camGlobal;
        this._ray = new THREE.Raycaster();
    }

    private _randomDirection(b: THREE.Vector3, t: number = Math.PI / 2) {
        b.normalize();

        var u = new THREE.Vector3();
        u.copy(b);
        u.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * t - t / 2);
        // u.setY(Math.random() * 1 - 0.5);
        u.setY(Math.random() * 1.5);
        u.normalize();

        return u;
    }

    public shootRay(direction: THREE.Vector3) {
        var randdirection = this._randomDirection(direction);
        this._ray.set(this._camGlobal.position, randdirection);
        this._ray.far = 50;
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
                console.log(hit[0]);
                return hit[0]
            }
        }
        return null;
    }

    public initialize() {}

    public placeLyrics(p: CharTexMapType) {
        console.log("placing lyrics");
        console.log(p);

        const { x, y, z } = Globals.sceneParams.camera?.direction!;
        const d = new THREE.Vector3(x, y, z);
        var hit = null;
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
            c._plane.rotation.copy(norm);
            c._plane.rotateY(Math.PI);
            this._parentObject.add(c._plane);
            console.log("placed", c);
        }
    }

    public update() {
    }

    public _onParamsChanged(): void {
    }
}
