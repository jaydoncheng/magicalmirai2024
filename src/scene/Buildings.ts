import * as THREE from "three";
import {
  BuildingGenerator,
  type BuildingParams,
  p_TwistyTower,
} from "./Building";
import { SceneBase } from "./SceneBase";
import { OBB } from "three/examples/jsm/math/OBB.js";
import Globals from "../core/Globals";

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

  private keyframeIndex = 1;

  public plotAndBuild(curPos: THREE.Vector3, disLimit: number) {
    var keyframeArr = Globals.currentSong.keyframes;
    console.log(
      "next keyframe timestamp: " + keyframeArr[this.keyframeIndex].timestamp,
    );
    var deltaTime =
      (keyframeArr[this.keyframeIndex].timestamp - this.elapsedTime) / 1000;

    const { x, y, z } =
      keyframeArr[this.keyframeIndex - 1].sceneParams.camera?.direction;
    var direction = new THREE.Vector3(x!, y!, z!).normalize();

    var distance = deltaTime * Globals.sceneParams.camera?.relativeSpeed! * 3;
    var dirChange = new THREE.Vector3()
      .copy(curPos)
      .add(direction.multiplyScalar(distance));

    console.log("distance: " + distance + ", disLimit: " + disLimit);

    var destination = new THREE.Vector3()
      .copy(curPos)
      .add(direction.normalize().multiplyScalar(disLimit));

    console.log("curPos:");
    console.log(curPos);
    console.log("To limit:");
    console.log(destination);
    console.log("To dirChange:");
    console.log(dirChange);

    if (distance > disLimit) {
      console.log("distance was bigger");
      this.populate(curPos, destination);
      return destination;
    } else if (distance == disLimit) {
      console.log("distance was equal");
      // unlikely but just incase
      this.populate(curPos, destination);
      if (this.keyframeIndex < Globals.currentSong.keyframes.length) {
        this.keyframeIndex++;
      }
      return destination;
    } else {
      console.log("distance was smaller");
      this.populate(curPos, dirChange);
      if (this.keyframeIndex < Globals.currentSong.keyframes.length) {
        this.keyframeIndex++;
      }
      console.log("recurse");
      return this.plotAndBuild(dirChange, disLimit - distance);
    }
  }

  public _onParamsChanged() {}

  private __direction = new THREE.Vector3();
  private __dirNormal = new THREE.Vector3();

  private _collisionBox = new OBB();

  public populate(from: THREE.Vector3, to: THREE.Vector3) {
    console.log("populate func");
    console.log(from);
    console.log(to);

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

      buildingMesh.position.z = Math.random() * distance;
      if (Math.random() >= 0.5) {
        buildingMesh.position.x = Math.random() * 20 + 10;
      } else {
        buildingMesh.position.x = Math.random() * 20 - 30;
      }
      buildingGroup.add(buildingMesh);
    }
    buildingGroup.position.copy(from);
    buildingGroup.lookAt(to);

    var center = new THREE.Vector3().copy(from);

    this._collisionBox.applyMatrix4(buildingGroup.matrixWorld);
    this._collisionBox.center = center.add(direction);
    this._collisionBox.halfSize = new THREE.Vector3(50, 50, distance);

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

  private elapsedTime = 0;

  public songUpdate(time: number) {
    this.elapsedTime = time;
  }
}
