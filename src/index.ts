import { Building } from "./scene/Building";
import { SceneManager } from "./scene/SceneManager";

class Main {
  private _sceneManager: SceneManager;
  private maxPlot = 1;
  private location = 0.0;

  constructor() {}

  public initialize() {
    this._sceneManager = new SceneManager();
    // var _building = new Building(1, 2, 3);
    // _building.move(1, 2, 3);
    // this._sceneManager.addBuilding(_building);

    var i = true;

    // loop to create buildings
    while (i) {
      this.location++;
      var _building = new Building(0.9, 1, 0.9);
      _building.move(1, 0, this.location + 0.5);

      this._sceneManager.addBuilding(_building);

      if (this.location > 10) i = false;
    }

    this._sceneManager.resize();
    this._sceneManager.update();
    this._sceneManager.updateTest();
  }

  private _resize() {
    this._sceneManager.resize();
  }
}

new Main().initialize();
