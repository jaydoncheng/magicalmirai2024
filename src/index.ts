import { ThreeManager } from "./scene/ThreeManager";
import { PlayerManager } from "./player/PlayerManager";
import Globals from "./core/Globals";
import Controls from "./core/Controls";

class Main {
    private _threeManager: ThreeManager;
    private _player: PlayerManager;

    constructor() { }

    public initialize() {
        Globals.controls = Controls;
        this._threeManager = Globals.three = new ThreeManager();
        // this._player = Globals.player = new PlayerManager();

        this._threeManager.resize();
        window.addEventListener("resize", this._resize.bind(this));
    }

    private _resize() {
        console.log("resize");
        this._threeManager.resize();
    }
}

new Main().initialize();
