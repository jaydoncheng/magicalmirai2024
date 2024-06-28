import * as THREE from "three";
import { SceneBase } from "./SceneBase"
import Globals from "../core/Globals";

export class Skybox extends SceneBase {
    private _skybox: THREE.Mesh;
    private _geometry: THREE.SphereGeometry;
    private _material: THREE.ShaderMaterial;

    private _palette: typeof Globals.sceneParams.palette;
    private _fog : THREE.Fog;

    constructor(_parentScene: THREE.Scene) {
        super(_parentScene);

        this._geometry = new THREE.SphereGeometry(100, 32, 32);
        this._material = new THREE.ShaderMaterial({ side: THREE.BackSide, 
            uniforms: {
                topColor: { value: new THREE.Color(0xff0000) },
                bottomColor: { value: new THREE.Color(0xff0000) },
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

    private generateNoiseTexture() {
        // implement later
    }

    public initialize() {
        this._parentScene.background = new THREE.Color(this._palette!.sky);
        var fog = this._fog = new THREE.Fog(new THREE.Color(this._palette!.fog), 0.015, 100);
        this._parentScene.fog = fog;

        this._material.uniforms.topColor = { value: new THREE.Color(this._palette!.sky) };
        this._material.uniforms.bottomColor = { value: new THREE.Color(this._palette!.fog) };

        return this._skybox;
    }

    public update() {}

    public _onParamsChanged(params: any) {
        this._parentScene.background = new THREE.Color(this._palette!.sky);
        this._fog.color = new THREE.Color(this._palette!.fog);

        this._material.uniforms.topColor = { value: new THREE.Color(this._palette!.sky) };
        this._material.uniforms.bottomColor = { value: new THREE.Color(this._palette!.fog) };
    }
}
