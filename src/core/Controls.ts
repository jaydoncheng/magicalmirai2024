import Globals from "./Globals";

class Controls {
    public playBtn: HTMLElement;
    public pauseBtn: HTMLElement;
    public stopBtn: HTMLElement;
    public loadingEl: HTMLElement;
    public controlsEl: HTMLElement;

    private _onPlayFncs: Function[] = [];
    private _onPauseFncs: Function[] = [];
    private _onStopFncs: Function[] = [];
    public _whoisReady = {};

    constructor() {
        var playBtn = (this.playBtn = document.querySelector("#bt_play")!);
        var pauseBtn = (this.pauseBtn = document.querySelector("#bt_pause")!);
        var stopBtn = (this.stopBtn = document.querySelector("#bt_stop")!);
        this.loadingEl = document.querySelector("#loading")!;
        this.controlsEl = document.querySelector("#controls")!;

        const song_selector = document.querySelector("#song_selector")!;
        for (let song of Globals.songs) {
            const option = document.createElement("option");
            option.value = Globals.songs.indexOf(song).toString();
            option.text = song.songName;
            song_selector.appendChild(option);
        }

        song_selector.addEventListener("change", (e) => {
            const index = parseInt((e.target as HTMLSelectElement).value);
            Globals.changeSong(index);
        });

        const handleBtn = (fncL: Function[], fnc: Function) => (e) => {
            e.preventDefault();
            for (const fnc of fncL) fnc();
            fnc();
            return false;
        };

        playBtn.addEventListener(
            "click",
            handleBtn(this._onPlayFncs, () => this.togglePlayPause()),
        );
        pauseBtn.addEventListener(
            "click",
            handleBtn(this._onPauseFncs, () => this.togglePlayPause()),
        );
        stopBtn.addEventListener(
            "click",
            handleBtn(this._onStopFncs, () => this.reset()),
        );
    }

    // Any component which needs to be ready before the controls
    // can be displayed should call this method with state = false
    // When the component is ready, call this function with state = true
    public setReady(caller: string, state: boolean) {
        this._whoisReady[caller] = state;
        this._onReady();
    }
    
    private _onReady() {
        if (Object.values(this._whoisReady).every((v) => v === true)) {
            this.loadingEl.style.display = "none";
            this.controlsEl.style.display = "block";
            return true;
        } else {
            this.loadingEl.style.display = "block";
            this.controlsEl.style.display = "none";
            return false;
        }
    }

    public reset() {
        this.pauseBtn.style.display = "none";
        this.playBtn.style.display = "inline";
        this.stopBtn.style.display = "inline";
    }

    public setPlay() {
        this.pauseBtn.style.display = "none";
        this.playBtn.style.display = "inline";
    }
    
    public setPause() {
        this.playBtn.style.display = "none";
        this.pauseBtn.style.display = "inline";
    }

    public togglePlayPause() {
        if (this.playBtn.style.display === "none") {
            this.setPlay();
        } else {
            this.setPause();
        }
    }

    // Callbacks whenever the play, pause, or stop buttons are clicked
    onPlay(fnc: Function) { this._onPlayFncs.push(fnc); }
    onPause(fnc: Function) { this._onPauseFncs.push(fnc); }
    onStop(fnc: Function) { this._onStopFncs.push(fnc); }
}

export type ControlsType = Controls;
export default new Controls();
