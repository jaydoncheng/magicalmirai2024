import { PlayerManager } from '../player/PlayerManager';
import { ThreeManager } from '../scene/ThreeManager';
import { ControlsType } from './Controls';
import SceneParams, { ISceneParams } from './SceneParams';
import { ISong } from './ISong'
import Songs from './songs'
import Textures from './Textures'

export default {
    songs: Songs as ISong[],
    currentSong: Songs[0],
    changeSong: function (index: number) {
        if (index < 0 || index >= this.songs.length) return;
        this.currentSong = this.songs[index]
        const event = new CustomEvent('songchanged', { detail: this.currentSong })
        window.dispatchEvent(event)
    },

    player: null as PlayerManager | null,
    three: null as ThreeManager | null,
    controls: null as ControlsType | null,

    sceneParams: SceneParams,
    updateSceneParams: function (params: ISceneParams) {
        this.sceneParams = { ...this.sceneParams, ...params };
        const event = new CustomEvent('paramschanged', { detail: this.sceneParams })
        console.log("paramschanged", this.sceneParams)
        window.dispatchEvent(event)
    },

    textures: Textures,
}

