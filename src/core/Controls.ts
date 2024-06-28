import Globals from "./Globals";
import { GUI, GUIController } from "dat.gui";

class Controls {
    public playBtn: HTMLElement;
    public pauseBtn: HTMLElement;
    public stopBtn: HTMLElement;
    public editorBtn: HTMLElement;
    public loadingEl: HTMLElement;
    public controlsEl: HTMLElement;

    private _onPlay: Function[] = [];
    private _onPause: Function[] = [];
    private _onStop: Function[] = [];
    private _whoisReady = {};

    private _datGUI: GUI;
    private _datGUIControls: { [key: string]: GUIController } = {};

    constructor() {

        var playBtn = this.playBtn = document.querySelector("#bt_play")!;
        var pauseBtn = this.pauseBtn = document.querySelector("#bt_pause")!;
        var stopBtn = this.stopBtn = document.querySelector("#bt_stop")!;
        var editorBtn = this.editorBtn = document.querySelector("#bt_editor")!;
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
        }

        playBtn.addEventListener("click", handleBtn(this._onPlay, () => this.togglePlayPause()));
        pauseBtn.addEventListener("click", handleBtn(this._onPause, () => this.togglePlayPause()));
        stopBtn.addEventListener("click", handleBtn(this._onStop, () => this.reset()));

        editorBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const editorEl: HTMLElement = document.querySelector("#editor")!;
            editorEl.classList.toggle("active");
            return false;
        });

        document.querySelector("#bt_close_editor")!.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector("#editor")!.classList.toggle("active");
            return false;
        });

        this.initDatGUI();
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

    private _traverseObj(obj: any, folder: GUI = this._datGUI) {
        for (var k in obj) {
            var controller : GUIController | null = null;
            if (typeof obj[k] === "function") {
                // implement later maybe
                continue
            } else if (typeof obj[k] === "string") {
                if (obj[k].startsWith("#")) {
                    controller = folder.addColor(obj, k);
                } else {
                    controller = folder.add(obj, k);
                }
            } else if (typeof obj[k] === "number") {
                controller = folder.add(obj, k);
            }

            controller?.onFinishChange((value) => {
                Globals.three?._onParamsChanged(value);
            });

            if (typeof obj[k] === "object" && obj[k] !== null) {
                this._traverseObj(obj[k], folder.addFolder(k));
            } 
        }
    }

    private initDatGUI() {
        this._datGUI = new GUI();
        this._datGUI.width = 300;
        document.querySelector("#dg")!.appendChild(this._datGUI.domElement);

        this._datGUI.remember(Globals.sceneParams);
        this._traverseObj(Globals.sceneParams, this._datGUI);
    }
}

export type ControlsType = Controls;
export default new Controls();
