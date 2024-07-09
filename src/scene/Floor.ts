import * as THREE from "three";
import { ISceneParams } from "../core/SceneParams";
import { SceneBase } from "./SceneBase";
import Globals from "../core/Globals";

export class FloorMng extends SceneBase {
    private _plane : THREE.Mesh;

    constructor(parentObj : THREE.Object3D) {
        super(parentObj);
    }

    public initialize() {
        var plane = this._plane = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400, 1, 1),
        new THREE.MeshStandardMaterial({
            color: Globals.sceneParams.palette?.plane,
            side: THREE.DoubleSide,
        }));
        
        plane.receiveShadow = true;
        plane.castShadow = true;
        plane.rotateX(Math.PI / 2);
        plane.position.set(0, -3, 0);

        this._parentObject.add(this._plane);
        return this._plane;
    }

    public update() {}

    public _onParamsChanged(details: ISceneParams): void {
        // this._plane.material.color.setHex(details.palette?.plane);
    }
}
