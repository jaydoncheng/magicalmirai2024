import { Player, ITextUnit, PlayerOptions } from 'textalive-app-api'
import Globals from '../core/Globals';
import { LyricsManager } from './LyricsManager';

export class PlayerManager {
    public player: Player;
    private _playerOptions: PlayerOptions = {
        app: { token: "U0WiRzyOIaolhCks" },
        mediaElement: document.querySelector("#media")! as HTMLMediaElement,
        mediaBannerPosition: "bottom left",
        throttleInterval: 200,
        vocalAmplitudeEnabled: true,
        valenceArousalEnabled: true,
    }

    private _keyframes = Globals.currentSong.keyframes;
    private _curKeyframeIndex = 0;

    private _position = 0;
    private _updateTime = -1;

    private _lyricsManager: LyricsManager;

    constructor() {
        this._lyricsManager = new LyricsManager();

        Globals.controls!.setReady("player", false);
        const media: HTMLElement | null = document.querySelector("#media");
        if (media === null) {
            throw new Error("media element not found");
        }

        Globals.controls!.onPlay(() => {
            this.player.requestPlay();
        });
        Globals.controls!.onPause(() => {
            this.player.requestPause();
        });
        Globals.controls!.onStop(() => {
            this._reset();
        });

        this._initPlayer();
        window.addEventListener("songchanged", () => {
            this._onSongChanged();
        });
    }

    private _initPlayer() {
        var player = (this.player = new Player(this._playerOptions));
        this._position = 0;
        this._updateTime = -1;
        this._curKeyframeIndex = 0;

        player.addListener({
            onAppReady: (app) => { this._onAppReady(app) },
            onAppMediaChange: () => { this._onAppMediaChange() },
            onVideoReady: (v) => { this._onVideoReady(v) },
            onTimerReady: () => { this._onTimerReady() },
            onThrottledTimeUpdate: (time) => { this._onTimeUpdate(time) },
            onPlay: () => { this._onPlay() },
            onPause: () => { console.log("onPause") },
            onStop: () => { this._onStop() },
        });

        Globals.updateSceneParams(this._keyframes[this._curKeyframeIndex].sceneParams);
        this._update();
    }
    private _onSongChanged() {
        this.player.requestStop();

        Globals.controls!.reset();
        Globals.controls!.setReady("player", false);

        this._initPlayer();
    }

    private _onAppReady(app: any) {
        if (!app.songUrl) {
            this.player.createFromSongUrl(Globals.currentSong.songUrl, {
                video: Globals.currentSong.video,
            });
        }
    }

    private _onPlay() {
        console.log("play");
        this._updateTime = Date.now();
    }

    private _onStop() {
        console.log("stop");
        this._reset();
    }

    public _reset() {
        console.log("reset");
        this._curKeyframeIndex = 0;

        this._position = 0;
        this._updateTime = -1;

        Globals.updateSceneParams(this._keyframes[this._curKeyframeIndex].sceneParams);
        this._genKeyframes();
        this.player.requestMediaSeek(0);
        this.player.setVideoPosition(0);
    }

    private _prevUnit: ITextUnit | null = null;
    private animateWord(now: any, unit: ITextUnit) {
        if (unit.contains(now)) {
            if (unit.startTime <= now + 500 && unit.endTime >= now) {
                if (unit !== this._prevUnit) {
                    this._prevUnit = unit;
                    this._lyricsManager.handleWord(unit.text);
                }
            }
        }
    }

    private animateChar(now: any, unit: ITextUnit) {
        if (unit.contains(now)) {
            if (unit.startTime <= now + 500 && unit.endTime >= now) {
                this._lyricsManager.handleChar(unit.text);
            }
        }
    }

    private _onVideoReady(v: any) {
        console.log("onVideoReady");
        this._genKeyframes();

        let w = this.player.video.firstWord;
        let c = this.player.video.firstChar;
        this.animateWord = this.animateWord.bind(this);
        this.animateChar = this.animateChar.bind(this);

        while (w) {
            w.animate = this.animateWord;
            w = w.next;
        }

        while (c) {
            c.animate = this.animateChar;
            c = c.next;
        }
    }

    private _genKeyframes() {
        this._keyframes = Globals.currentSong.keyframes;

        var directionX = 0;
        var choruses = this.player.getChoruses();
        for (var i = 0; i < choruses.length; i++) {
            let timestamp = Math.round(choruses[i].startTime.valueOf());

            let valAro = this.player.getValenceArousal(timestamp);
            let valence = Math.pow(valAro.v, 2) * 25;
            let arousal = Math.pow(valAro.a, 2) * 100;

            directionX += (Math.random() * 6) - 3;
            let speed = (arousal) + 2;

            if (this._keyframes.find((k) => k.timestamp === timestamp)) {
                continue;
            }

            this._keyframes.push({
                timestamp: timestamp,
                sceneParams: {
                    camera: {
                        sway: valence,
                        direction: { x: directionX, y: 0, z: 1 },
                        relativeSpeed: speed,
                    },
                }
            });
        }

        // last keyframe
        this._keyframes.push({
            timestamp: 10000000,
            sceneParams: {
                camera: {
                    sway: 0,
                    direction: { x: 0, y: 0, z: 1 },
                    relativeSpeed: 5,
                },
            }
        });

        Globals.currentSong.keyframes = this._keyframes;
        console.log("keyframes:");
        for (var i = 0; i < this._keyframes.length; i++) {
            console.log(this._keyframes[i].timestamp, this._keyframes[i].sceneParams);
        }

    }

    private _onAppMediaChange() {
        console.log("onAppMediaChange");
        this.player.requestMediaSeek(0);
        this.player.requestPause();
    }

    private _onTimerReady() {
        console.log("onTimerReady");
        Globals.controls!.setReady("player", true);
        this.player.requestStop();
    }

    private _updateKeyframe(t: number) {
        if (this._curKeyframeIndex < this._keyframes.length) {
            if (t > this._keyframes[this._curKeyframeIndex].timestamp) {
                console.log("update keyframe", this._curKeyframeIndex);
                Globals.updateSceneParams(this._keyframes[this._curKeyframeIndex].sceneParams);
                this._curKeyframeIndex++;
            }
        }

    }
    private _update() {
        if (this.player && this.player.isPlaying && this._updateTime > 0) {
            var t = Date.now() - this._updateTime + this._position;

            this._updateKeyframe(t);
            Globals.three!.songUpdate(t);
        }

        requestAnimationFrame(() => { this._update(); });
    }

    private _onTimeUpdate(time: number) {
        this._position = time;
        this._updateTime = Date.now();
    }
}
