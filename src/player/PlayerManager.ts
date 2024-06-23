import { Player, IVideo, IChar } from 'textalive-app-api'
import Globals from '../core/Globals';

export class PlayerManager {
    // TODO: Once loading/ready process is implemented in Globals.controls,
    // remove any lines that reference #loading and #controls
    private _player: Player;
    private _video: IVideo;
    private _playerOptions: any = {
        app: { token: "U0WiRzyOIaolhCks" },
        mediaElement: document.querySelector("#media")!,
        mediaBannerPosition: "bottom right"
    }

    constructor() {
        Globals.controls.setReady("player", false);
        const media: HTMLElement | null = document.querySelector("#media");
        if (media === null) {
            throw new Error("media element not found");
        }

        Globals.controls.onPlay(() => { this._player.requestPlay(); });
        Globals.controls.onPause(() => { this._player.requestPause(); });
        Globals.controls.onStop(() => { this._player.requestStop(); });

        this._initPlayer();

        window.addEventListener("songchanged", () => {
            this._onSongChanged();
        });
    }

    private _initPlayer() {
        var player = this._player = new Player(this._playerOptions);

        player.addListener({
            onAppReady(app) {
                if (app.managed) {
                    // TODO: what the FUCK is a lifecycle :fire: :fire:
                    // document.querySelector("#control")!.className = "disabled";
                }
                if (!app.songUrl) {
                    player.createFromSongUrl(Globals.currentSong.songUrl, {
                        video: Globals.currentSong.video,
                    })
                }
            },

            onVideoReady(v) {
                console.log("onVideoReady");
            },

            onTimerReady() {
                console.log("onTimerReady");
                Globals.controls.setReady('player', true);
            },

            onTimeUpdate(time) {
                console.log("onTimeUpdate", time);
                // TODO: Implement scene updating, character processing, etc
            },

            onPlay() {
                console.log("onPlay");
            },

            onPause() {
                console.log("onPause");
            }
        });
    }
    private _onSongChanged() {
        this._player.requestStop();

        Globals.controls.reset();
        Globals.controls.setReady("player", false);

        this._initPlayer();

    }
}
