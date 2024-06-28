import * as THREE from "three";
import { SceneBase } from "./SceneBase"
import Globals from "../core/Globals";

export class Skybox extends SceneBase {
    private _skybox: THREE.Mesh;
    private _geometry: THREE.SphereGeometry;
    private _material: THREE.ShaderMaterial;

    private _palette: any;
    private _fog : THREE.Fog;

    constructor(_parentScene: THREE.Scene) {
        super(_parentScene);

        this._geometry = new THREE.SphereGeometry(100, 32, 32);
        this._material = new THREE.ShaderMaterial({ side: THREE.BackSide, 
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 33 },
                exponent: { value: 0.6 },
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
        });


        this._skybox = new THREE.Mesh(this._geometry, this._material);

        this._palette = Globals.sceneParams.palette;
    }

    public initialize() {
        this._parentScene.background = new THREE.Color(this._palette.sky);
        var fog = this._fog = new THREE.Fog(this._palette.sky, 0.015, 100);
        this._parentScene.fog = fog;

        return this._skybox;
    }

    public update() {}

    public _onParamsChanged(params: any) {
        this._parentScene.background = new THREE.Color(this._palette.sky);
        this._fog.color = new THREE.Color(this._palette.sky);

        this._material.uniforms.topColor.value.setHex(this._palette.sky);
        this._material.uniforms.bottomColor.value.setHex(this._palette.sky);
    }
}
