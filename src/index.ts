import { Building } from "./scene/Building";
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
        // this._player = Globals.player = new PlayerManager();


        // var i: number = 0;
        // while (i < this.maxPlot) {
        //     var x = i % 10 + i;
        //     var _building = new Building(0.9, 1, 0.9);
        //     _building.move(1, 0, x);
        //     this._sceneManager.addBuilding(_building);
        //
        //     i++;
        // }
        //
        this._sceneManager.resize();
        this._sceneManager.update();

        window.addEventListener("resize", this._resize.bind(this));
    }

    private _resize() {
        console.log("resize");
        this._sceneManager.resize();
    }
}

new Main().initialize();
