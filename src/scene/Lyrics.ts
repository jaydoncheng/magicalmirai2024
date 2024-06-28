import * as THREE from 'three';
import { SceneBase } from "./SceneBase";

export class LyricsManager extends SceneBase {
    private _textCanvasEl: HTMLCanvasElement;
    private _texture: THREE.Texture;
    private _material: THREE.Material;
    private _textPlane: THREE.Mesh;

    constructor(_parentScene: THREE.Scene) {
        super(_parentScene);
        this._textCanvasEl = document.createElement('canvas');
        this._textCanvasEl.width = 1024;
        this._textCanvasEl.height = 1024;
        this._textCanvasEl.style.position = 'absolute';
        this._textCanvasEl.style.display = 'none';
        this._textCanvasEl.style.top = '0';
        this._textCanvasEl.style.left = '0';
        this._textCanvasEl.style.zIndex = '100';

        this._texture = new THREE.CanvasTexture(this._textCanvasEl);
        this._texture.magFilter = THREE.NearestFilter;
        this._texture.minFilter = THREE.NearestMipmapLinearFilter;
        this._texture.mapping = THREE.EquirectangularReflectionMapping;

        this._material = new THREE.MeshBasicMaterial({ map: this._texture, transparent: true,
            side: THREE.DoubleSide});

        this._textPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            this._material
        );
        this._textPlane.scale.set(3, 3, 1);
        this._textPlane.position.set(0, 1, -2);
        this._textPlane.rotation.x = -Math.PI;
        this._textPlane.rotation.y = Math.PI;
        this._textPlane.rotation.z = Math.PI;
    }

    public drawText(text: string) {
        const ctx = this._textCanvasEl.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.clearRect(0, 0, this._textCanvasEl.width, this._textCanvasEl.height);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, this._textCanvasEl.width / 2, this._textCanvasEl.height / 2);
        }
    }

    public initialize() {
        document.body.appendChild(this._textCanvasEl);

        // this._scene.add(this._textPlane);
        return this._textPlane;
    }

    
    public update() {
    }

    public _onParamsChanged(params: any): void {
    }
}
