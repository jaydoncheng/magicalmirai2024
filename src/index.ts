import { SceneManager } from "./scene/SceneManager";

class Main {
    private _sceneManager: SceneManager;

    constructor() { }

    public initialize() {
        this._sceneManager = new SceneManager();
        this._sceneManager.resize();
        this._sceneManager.update();
        // this._sceneManager.updateTest();
    }

    private _resize() {
        this._sceneManager.resize();
    }
}

new Main().initialize();
