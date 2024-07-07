import * as THREE from "three";
import { SceneBase } from "./SceneBase";
import Globals from "../core/Globals";

export class Skybox extends SceneBase {
    private _skybox: THREE.Mesh;
    private _geometry: THREE.SphereGeometry;
    private _material: THREE.ShaderMaterial;

    private _scene: THREE.Scene;
    private _palette: typeof Globals.sceneParams.palette;
    private _fog: THREE.Fog;

    constructor(_parentObject: THREE.Group, _scene: THREE.Scene) {
        super(_parentObject);
        this._scene = _scene;

        this._geometry = new THREE.SphereGeometry(200, 32, 32);
        this._material = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                topColor: { value: new THREE.Color(0xff0000) },
                bottomColor: { value: new THREE.Color(0xff0000) },
                offset: { value: 25 },
                exponent: { value: 0.6 },
            },
            vertexShader: this._vertexShader,
            fragmentShader: this._fragmentShader,
        });

        this._skybox = new THREE.Mesh(this._geometry, this._material);
        this._palette = Globals.sceneParams.palette;
    }

    private generateNoiseTexture() {
        // implement later
    }

    public initialize() {
        var fog = (this._fog = new THREE.Fog(
            new THREE.Color(this._palette!.fog),
            0.015,
            100,
        ));
        this._scene.fog = fog;

        this._material.uniforms.topColor = {
            value: new THREE.Color(this._palette!.sky),
        };
        this._material.uniforms.bottomColor = {
            value: new THREE.Color(this._palette!.fog),
        };

        this._parentObject.add(this._skybox);
    }

    public update() { }

    public _onParamsChanged() {
        console.log("skybox params changed");
        this._palette = Globals.sceneParams.palette;
        console.log(this._palette);
        console.log(Globals.sceneParams);
        this._fog.color = new THREE.Color(this._palette!.fog);

        this._material.uniforms.topColor = {
            value: new THREE.Color(this._palette!.sky),
        };
        this._material.uniforms.bottomColor = {
            value: new THREE.Color(this._palette!.fog),
        };
    }

    private _fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;

        void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
    `;

    private _vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
}
