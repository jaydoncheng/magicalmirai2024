import * as THREE from 'three'

var textureFiles = {
    'building1': 'assets/building1.png',
}

class Textures {
    private _textures: { [key: string]: THREE.Texture } = {}

    constructor() {
        const loader = new THREE.TextureLoader()

        for (const key in textureFiles) {
            loader.load(textureFiles[key], (texture) => {
                this._textures[key] = texture
            }, undefined, (err) => {
                console.error(err)
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
