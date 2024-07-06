import * as THREE from 'three';

export class CharTex {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    public _texture: THREE.Texture;
    public _char: string
    constructor(char: string) {
        this._char = char;

        this._initCanvas();
        this._initTexture();

        this._drawChar();

    }

    private _drawChar() {
        var ctx = this._ctx;

        ctx.fillStyle = 'white';
        ctx.font = '80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this._char, this._canvas.width / 2, this._canvas.height / 2);
    }

    private _initCanvas(size: number = 1) {
        this._canvas = document.createElement('canvas')
        this._canvas.width = this._canvas.height = size;
        var ctx = this._canvas.getContext('2d');
        if (ctx) {
            this._ctx = ctx;
            this._ctx.clearRect(0, 0, size, size);
        }
    }

    private _initTexture() {
        var texture = this._texture = new THREE.Texture(this._canvas);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
    }

    public dispose() {
        // TODO: implement
    }
}

export class CharTexMap {
    private _charTexMap: { [key: string]: CharTex } = {};
    constructor() { }

    public hasChar(char: string) {
        return this._charTexMap[char] !== undefined;
    }

    public getCharTex(char: string) {
        if (!this.hasChar(char)) {
            return this._charTexMap[char] = new CharTex(char);
        } else {
            return this._charTexMap[char]
        }
    }
}
