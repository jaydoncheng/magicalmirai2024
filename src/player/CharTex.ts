import * as THREE from 'three';

export class CharTex {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    public texture: THREE.Texture;
    public plane: THREE.Mesh;
    public char: string
    public index: number = 0;

    constructor(char: string, _index: number = 0) {
        this.char = char;
        this.index = _index;

        this._initCanvas();
        this._drawChar();

        this._initTexture();
        this._initPlane();
    }

    private _drawChar() {
        var ctx = this._ctx;

        ctx.fillStyle = 'white';
        ctx.font = '80px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, this._canvas.width / 2, this._canvas.height / 2);
    }

    private _initCanvas(size: number = 80) {
        this._canvas = document.createElement('canvas')
        this._canvas.width = this._canvas.height = size;
        var ctx = this._canvas.getContext('2d');
        if (ctx) {
            this._ctx = ctx;
            this._ctx.clearRect(0, 0, size, size);
        }
    }

    private _initTexture() {
        var texture = this.texture = new THREE.Texture(this._canvas);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
    }

    private _initPlane() {
        var geometry = new THREE.PlaneGeometry(1, 1);
        var material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, side: THREE.DoubleSide });
        this.plane = new THREE.Mesh(geometry, material);
    }

    public dispose() {
        this.texture.dispose();
        this.texture.dispose()
        this.plane.geometry.dispose();

        this._canvas.remove();
    }
}

export type CharTexMapType = CharTex[];
export class CharTexMap {
    private _charTexList: CharTexMapType = [];
    constructor() { }

    public newCharTex(char: string, i : number = 0) {
        let c = new CharTex(char, i);
        this._charTexList.push(c);
        return c;
    }

    public dispose() {
        for (let obj in this._charTexList) {
            obj.dispose();
        }
    }
}
