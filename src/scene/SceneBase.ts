import * as THREE from "three";
import { ISceneParams } from "../core/SceneParams";

export abstract class SceneBase {

    _parentObject: THREE.Object3D;
    constructor(parentObject : THREE.Object3D) {
        this._parentObject = parentObject;

        window.addEventListener('paramschanged', (e) => {
            this._onParamsChanged(e.detail);
        });
    }

    abstract initialize(): void; // initialize objects and add to scene
    abstract update(): void; // called by render loop
    abstract _onParamsChanged(details : ISceneParams): void; // called anytime sceneParams change
}
