import { SceneManager } from "./scene/SceneManager";

class Main
{
    private _sceneManager: SceneManager;

    constructor () {}
    
    public initialize ()
    {
        this._sceneManager = new SceneManager();
    }

    private _resize ()
    {
    }
}

new Main().initialize();
