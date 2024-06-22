import { Player, IVideo, IChar } from 'textalive-app-api'
import Globals from '../core/Globals';
import Controls from '../core/Controls';

export class PlayerManager {
    // TODO: Once loading/ready process is implemented in Controls,
    // remove any lines that reference #loading and #controls
    private _player: Player;
    private _video: IVideo;
    private _playerOptions: any = {
        app: { token: "U0WiRzyOIaolhCks" },
        mediaElement: document.querySelector("#media")!,
        mediaBannerPosition: "bottom right"
    }

    constructor() {
        const media: HTMLElement | null = document.querySelector("#media");
        if (media === null) {
            throw new Error("media element not found");
        }

        Controls.onPlay(() => { this._player.requestPlay(); });
        Controls.onPause(() => { this._player.requestPause(); });
        Controls.onStop(() => { this._player.requestStop(); });

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
                document.querySelector("#controls")!.style.display = "block";
                document.querySelector("#loading")!.style.display = "none";
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

        document.querySelector("#controls")!.style.display = "block";
        document.querySelector("#loading")!.style.display = "none";
        Controls.reset();

        this._initPlayer();

    }
}
