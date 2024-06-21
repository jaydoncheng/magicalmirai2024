import Globals from "./Globals";

class Controls {
    // TODO: Implement switching between loading and ready state;
    // Controls needs to somehow know that all the other
    // components (Player, Scene, etc) are ready to go.
    // Either through some kind of observer pattern or
    // by having the components call a method on Controls
    public playBtn: HTMLElement;
    public pauseBtn: HTMLElement;
    public stopBtn: HTMLElement;
    public loadingEl: HTMLElement;
    public controlsEl: HTMLElement;

    private _onPlay: Function[] = [];
    private _onPause: Function[] = [];
    private _onStop: Function[] = [];

    constructor() {
        console.log("Controls constructor")
        var playBtn = this.playBtn = document.querySelector("#bt_play")!;
        var pauseBtn = this.pauseBtn = document.querySelector("#bt_pause")!;
        var stopBtn = this.stopBtn = document.querySelector("#bt_rewind")!;
        var loadingEl = this.loadingEl = document.querySelector("#loading")!;
        var controlsEl = this.controlsEl = document.querySelector("#controls")!;

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

        playBtn.addEventListener("click", (e) => {
            e.preventDefault();
            for (const fnc of this._onPlay) {
                fnc();
            }
            this.togglePlayPause();
            return false;
        });

        pauseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            for (const fnc of this._onPause) {
                fnc();
            }
            this.togglePlayPause();
            return false;
        });

        stopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            for (const fnc of this._onStop) {
                fnc();
            }
            this.reset();
            return false;
        });
    }

    public reset() {
        this.pauseBtn.style.display = "none";
        this.playBtn.style.display = "inline";
        this.stopBtn.style.display = "inline";
    }

    public togglePlayPause() {
        if (this.playBtn.style.display === "none") {
            this.pauseBtn.style.display = "none";
            this.playBtn.style.display = "inline";
        } else {
            this.playBtn.style.display = "none";
            this.pauseBtn.style.display = "inline";
        }
    }

    public onPlay(fnc: Function) {
        this._onPlay.push(fnc);
    }

    public onPause(fnc: Function) {
        this._onPause.push(fnc);
    }

    public onStop(fnc: Function) {
        this._onStop.push(fnc);
    }
}

var controls = new Controls();
export default controls;
