import * as THREE from 'three';

export abstract class SceneBase {

    _parentObject: THREE.Object3D;
    constructor(parentObject : THREE.Object3D) {
        this._parentObject = parentObject;
    }

    abstract initialize(): void; // initialize objects and add to scene
    abstract update(): void; // called by render loop
    abstract _onParamsChanged(params: any): void; // called by Controller (dont use params rn)

}
