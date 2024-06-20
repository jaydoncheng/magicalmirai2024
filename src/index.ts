import { SceneManager } from "./scene/SceneManager";
import { PlayerManager } from "./player/PlayerManager";

class Main
{
    private _sceneManager: SceneManager;
    private _player: PlayerManager;

    constructor () {}
    
    public initialize ()
    {
        // this._sceneManager = new SceneManager();
        this._player = new PlayerManager();
    }

    private _resize ()
    {
    }
}

new Main().initialize();
