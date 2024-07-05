import * as THREE from "three";
import {
  BuildingGenerator,
  type BuildingParams,
  p_TwistyTower,
} from "./Building";
import { SceneBase } from "./SceneBase";
import { OBB } from "three/examples/jsm/math/OBB.js";

export class Buildings extends SceneBase {
  private buildingGroups: THREE.Group[] = [];
  private _buildingGenerator: BuildingGenerator;
  private buildingTypes: BuildingParams[] = [];

  constructor(_parentObject: THREE.Object3D) {
    super(_parentObject);
    this._buildingGenerator = new BuildingGenerator();
  }

  public initialize() {
    this.buildingTypes = []; // TODO: double check if old objects are being properly disposed
    this.buildingTypes.push(p_TwistyTower());
  }

  public update() {}

  public populationTest(
    curPos: THREE.Vector3,
    direction: THREE.Vector3,
    disLimit: number,
  ) {
    var dirChange = curPos.add(direction);
    var distance = curPos.distanceTo(dirChange);
    direction.normalize();

    if (distance > disLimit) {
      this.populate(curPos, curPos.add(direction.multiplyScalar(disLimit)));
    } else {
      this.populate(curPos, dirChange);
      this.populationTest(dirChange, dirChange, disLimit - distance);
    }
  }

  public _onParamsChanged() {}

  private __direction = new THREE.Vector3();
  private __dirNormal = new THREE.Vector3();

  private _collisionBox = new OBB();

  public populate(from: THREE.Vector3, to: THREE.Vector3) {
    var buildingGroup = new THREE.Group();

    var distance = from.distanceTo(to);
    var direction = new THREE.Vector3();
    direction.subVectors(to, from);
    direction.normalize();

    for (let i = 0; i < 10; i++) {
      // WARN: this is only approximately a normal distribution.
      let randBuilding = Math.floor(Math.random() * this.buildingTypes.length);

      var building = this.buildingTypes[randBuilding];
      var buildingMesh = this._buildingGenerator.genBuilding(building);

      this.__direction.copy(direction);
      this.__dirNormal.crossVectors(
        this.__direction,
        new THREE.Vector3(0, 1, 0),
      );
      this.__dirNormal.normalize();

      buildingMesh.position.z = distance * (10 / i);
      buildingMesh.position.x = Math.random() * 10 - 5;
      buildingGroup.add(buildingMesh);
    }
    buildingGroup.position.copy(from);
    buildingGroup.lookAt(to);

    this._collisionBox.applyMatrix4(buildingGroup.matrixWorld);
    this._collisionBox.center = from.add(direction);
    this._collisionBox.halfSize = new THREE.Vector3(10, 20, distance * 2);

    this.buildingGroups.push(buildingGroup);
    this._parentObject.add(buildingGroup);
  }

  public isColliding(position: THREE.Vector3) {
    return this._collisionBox.containsPoint(position);
  }

  public animate(building: BuildingGenerator) {
    // if (building.buildingBox.scale.y <= building.scale.y - 1) {
    //     console.log("animating");
    //
    //     building.popup();
    //     requestAnimationFrame(() => this.animate(building));
    // }
  }

  public deleteBlock() {
    if (this.buildingGroups.length > 0) {
      var bG: THREE.Group = this.buildingGroups.shift()!;
      this.purge(bG);
    }
  }

  public purge(obj: any) {
    if (obj.children.length > 0) {
      for (let i = obj.children.length - 1; i >= 0; i--) {
        this.purge(obj.children[i]);
      }
    }
    if (obj.isMesh) {
      obj.geometry.dispose();
      obj.material.dispose();
    }
    if (obj.parent) {
      obj.parent.remove(obj);
    }
  }
}
