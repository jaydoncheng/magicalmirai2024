import { PlayerManager } from '../player/PlayerManager';
import { ThreeManager } from '../scene/ThreeManager';
import { ControlsType } from './Controls';
import SceneParams from './SceneParams';
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
    textures: Textures,
}

