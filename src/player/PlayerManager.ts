import { Player, ITextUnit } from 'textalive-app-api'
import Globals from '../core/Globals';

export class PlayerManager {
    // TODO: Once loading/ready process is implemented in Globals.controls,
    // remove any lines that reference #loading and #controls
    public _player: Player;
    private _playerOptions: any = {
        app: { token: "U0WiRzyOIaolhCks" },
        mediaElement: document.querySelector("#media")!,
        mediaBannerPosition: "bottom left"
    }

    private _keyframes = Globals.currentSong.keyframes;
    private _currentKeyframeI = 0;

    private _position = 0;
    private _updateTime = -1;

    constructor() {
        Globals.controls!.setReady("player", false);
        const media: HTMLElement | null = document.querySelector("#media");
        if (media === null) {
            throw new Error("media element not found");
        }

        Globals.controls!.onPlay(() => { this._player.requestPlay(); });
        Globals.controls!.onPause(() => { this._player.requestPause(); });
        Globals.controls!.onStop(() => { this._reset() });

        this._initPlayer();

        window.addEventListener("songchanged", () => {
            this._onSongChanged();
        });
    }

    private _initPlayer() {
        var player = this._player = new Player(this._playerOptions);
        this._position = 0;
        this._updateTime = -1;
        this._currentKeyframeI = 0;
        this._keyframes = Globals.currentSong.keyframes;

        player.addListener({
            onAppReady: (app) => { this._onAppReady(app) },
            onAppMediaChange: () => { this._onAppMediaChange() },
            onVideoReady: (v) => { this._onVideoReady(v) },
            onTimerReady: () => { this._onTimerReady() },
            onThrottledTimeUpdate: (time) => { this._onTimeUpdate(time) },
            onPlay: () => { this._onPlay() },
            onPause() { console.log("onPause"); },
            onStop: () => { this._onStop() },
        });

        Globals.sceneParams = {
            ...Globals.sceneParams,
            ...this._keyframes[this._currentKeyframeI].sceneParams
        }
        Globals.three!._onParamsChanged();

        this._update();
    }
    private _onSongChanged() {
        this._player.requestStop();

        Globals.controls!.reset();
        Globals.controls!.setReady("player", false);

        this._initPlayer();
    }

    private _onAppReady(app: any) {
        if (!app.songUrl) {
            this._player.createFromSongUrl(Globals.currentSong.songUrl, {
                video: Globals.currentSong.video,
            })
        }
    }

    private _onPlay() {
        console.log("play")
        this._updateTime = Date.now();
    }

    private _onStop() {
        console.log("stop")
        this._reset();
    }

    public _reset() {
        this._player.requestMediaSeek(0);
        this._player.requestStop();
    }

    private _onVideoReady(v: any) {
        console.log("onVideoReady");

        // animate gets called everytime a "unit" comes up in the song
        const animate = function(now: any, unit: ITextUnit) {
            if (unit.contains(now)) {
                if (unit.startTime <= now && unit.endTime >= now) {
                    console.log(unit.text);
                    // Globals.three!.drawText(unit.text)
                }
            }
        }
        let w = this._player.video.firstWord;
        while (w) {
            w.animate = animate;
            w = w.next;
        }
    }

    private _onAppMediaChange() {
        console.log("onAppMediaChange");
        this._player.requestMediaSeek(0);
        this._player.requestPause();
    }

    private _onTimerReady() {
        console.log("onTimerReady");
        Globals.controls!.setReady('player', true);
        this._player.requestStop();
    }

    private _update() {
        if (this._player && this._player.isPlaying && this._updateTime > 0) {
            var t = (Date.now() - this._updateTime) + this._position;

            if (this._currentKeyframeI < this._keyframes.length) {
                if (t > this._keyframes[this._currentKeyframeI].timestamp) {
                    Globals.sceneParams = {
                        ...Globals.sceneParams,
                        ...this._keyframes[this._currentKeyframeI].sceneParams
                    }
                    Globals.three!._onParamsChanged();
                    this._currentKeyframeI++;
                }
            }
            Globals.three!.update(t);
        }
        requestAnimationFrame(() => { this._update() });
    }

    private _onTimeUpdate(time: number) {
        this._position = time;
        this._updateTime = Date.now();
    }
}
