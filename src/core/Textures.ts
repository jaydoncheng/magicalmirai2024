import * as THREE from 'three'

var textureFiles = {
    'building1': 'building1.png',
}

class Textures {
    private _textures: { [key: string]: THREE.Texture } = {}

    public isReady = false;
    constructor() {
        const loader = new THREE.TextureLoader()

        for (const key in textureFiles) {
            let texturePath = './textures/' + textureFiles[key]
            loader.load(texturePath, (texture) => {
                console.log('loaded texture', texturePath)
                console.log(texture)
                this._textures[key] = texture

                if (Object.keys(this._textures).length === Object.keys(textureFiles).length) {
                    this.isReady = true
                }
            }, undefined, (err) => {
                console.error('error loading texture', texturePath);
                console.error(err);
            })
        }
    }

    public getTexture(key: string): THREE.Texture {
        return this._textures[key]
    }

    public getTextures(): { [key: string]: THREE.Texture } {
        return this._textures
    }
}

export default new Textures();
