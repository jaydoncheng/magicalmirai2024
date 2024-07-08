import * as THREE from "three";
import { ISceneParams } from "../core/SceneParams";
import { SceneBase } from "./SceneBase";

export class Lights extends SceneBase {
    private _ambientLight: THREE.AmbientLight;
    private _directionalLight: THREE.DirectionalLight;
    private _spotLight: THREE.SpotLight;
    constructor(parentObj : THREE.Object3D) {
        super(parentObj);
    }

    public initialize() {
        this._ambientLight = new THREE.AmbientLight(0xaaaaaa);
        this._parentObject.add(this._ambientLight);

        this._directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
        this._directionalLight.position.set(0, 0, 1);
        this._directionalLight.castShadow = true;
        this._parentObject.add(this._directionalLight);

        this._spotLight = new THREE.SpotLight(0xffffff, 0.2);
        this._spotLight.position.set(0, 100, 0);
        this._spotLight.castShadow = true;
        this._spotLight.shadow.bias = -0.0001;
        this._parentObject.add(this._spotLight);
    }

    public update() {
        this._spotLight.position.copy(this._parentObject.position);
        this._spotLight.position.y += 100;
        this._spotLight.target = this._parentObject;
    }

    public _onParamsChanged(details: ISceneParams): void {
        
    }


}
