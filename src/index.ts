import { SceneManager } from "./scene/SceneManager";
import { PlayerManager } from "./player/PlayerManager";
import Globals from "./core/Globals";
import Controls from "./core/Controls";

class Main {
    private _sceneManager: SceneManager;
    private _player: PlayerManager;

    constructor() { }

    public initialize() {
        Globals.controls = Controls;
        this._sceneManager = Globals.scene = new SceneManager();
        this._player = Globals.player = new PlayerManager();

        this._sceneManager.resize();
        window.addEventListener("resize", this._resize.bind(this));
    }

    private _resize() {
        console.log("resize");
        this._sceneManager.resize();
    }
}

new Main().initialize();
