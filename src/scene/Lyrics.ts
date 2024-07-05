import * as THREE from 'three';
import { SceneBase } from "./SceneBase";

export class LyricsManager extends SceneBase {

    private _textCanvasEl: HTMLCanvasElement;
    private _texture: THREE.Texture;
    private _material: THREE.Material;
    private _textPlane: THREE.Mesh;
    private dpr = window.devicePixelRatio;
    constructor(_parentObject: THREE.Object3D) {
        super(_parentObject);

        this._textCanvasEl = document.createElement('canvas');
        this._textCanvasEl.width = document.body.clientWidth * this.dpr;
        this._textCanvasEl.height = document.body.clientHeight * this.dpr;

        this._texture = new THREE.CanvasTexture(this._textCanvasEl);
        this._texture.magFilter = THREE.NearestFilter;
        this._texture.minFilter = THREE.NearestMipmapLinearFilter;
        this._texture.mapping = THREE.EquirectangularReflectionMapping;

        this._material = new THREE.MeshBasicMaterial({
            map: this._texture, transparent: true,
            side: THREE.DoubleSide
        });

        this._textPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(this.dpr/2, this.dpr/2),
            this._material
        );
        console.log(this.dpr);
        this._textPlane.scale.set(this.dpr/2, this.dpr/2, 1);
        this._textPlane.position.set(0, 1, 0.5);
        this._textPlane.rotateX(-Math.PI);
        this._textPlane.rotateY(2*Math.PI);
        this._textPlane.rotateZ(Math.PI);
    }

    public drawText(text: string) {
        const ctx = this._textCanvasEl.getContext('2d');
        if (ctx) {
            ctx.scale(this.dpr, this.dpr);
            ctx.fillStyle = 'white';
            ctx.font = '80px Arial';
            ctx.clearRect(0, 0, this._textCanvasEl.width, this._textCanvasEl.height);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, this._textCanvasEl.width / 2, this._textCanvasEl.height / 2);
        }
    }

    public initialize() {
        document.body.appendChild(this._textCanvasEl);

        this._parentObject.add(this._textPlane);
        this.drawText('Hello');
    }


    public update() {
    }

    public _onParamsChanged(): void {
    }
}
