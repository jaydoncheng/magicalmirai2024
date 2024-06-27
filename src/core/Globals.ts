import { PlayerManager } from '../player/PlayerManager';
import { SceneManager } from '../scene/SceneManager';
import { ControlsType } from './Controls';
import SceneParams from './SceneParams';
import { ISong } from './ISong'
import Songs from './songs'

export default {
    songs: Songs as ISong[],
    currentSong: Songs[0],
    changeSong: function (index: number) {
        // TODO: might be a better way to do this
        if (index < 0 || index >= this.songs.length) return;
        this.currentSong = this.songs[index]
        const event = new CustomEvent('songchanged', { detail: this.currentSong })
        window.dispatchEvent(event)
    },

    player: null as PlayerManager | null,
    scene: null as SceneManager | null,
    controls: null as ControlsType | null,

    sceneParams: SceneParams,
}

