import * as THREE from 'three';

export abstract class SceneBase {
    _parentScene: THREE.Scene;
    constructor(parentScene : THREE.Scene) {
        this._parentScene = parentScene;
    }

    abstract initialize(): void; // initialize objects and add to scene
    abstract update(): void; // called by render loop
    abstract _onParamsChanged(params: any): void; // called by Controller

}
