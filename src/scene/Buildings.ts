import * as THREE from "three";
import {
    BuildingGenerator,
    type BuildingParams,
    p_TwistyTower,
    p_BlockyTower,
} from "./Building";
import { SceneBase } from "./SceneBase";
import Globals from "../core/Globals";
import { CameraManager } from "./CameraManager";

export class Buildings extends SceneBase {
    private _buildingGroups: THREE.Group[] = [];
    private _buildingGenerator: BuildingGenerator;
    private _buildingTypes: BuildingParams[] = [];

    private _camMng: CameraManager;
    private _collisionPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    constructor(_parentObject: THREE.Object3D, _camMng: CameraManager) {
        super(_parentObject);
        this._buildingGenerator = new BuildingGenerator();
        this._camMng = _camMng;
    }

    public initialize() {
        this._buildingTypes = []; // TODO: double check if old objects are being properly disposed
        this._buildingTypes.push(p_TwistyTower());
        this._buildingTypes.push(p_BlockyTower());

        this._collisionPoint = this.plotAndBuild(
            this._camMng.getCamGlobal().position,
            100,
            0,
        );
        console.log("DONE WITH FIRST BUILD");

        Globals.controls!.onStop(() => {
            this.reset();
        });
    }

    public update() { 
        if (this._camMng.getCamGlobal().position.distanceTo(this._collisionPoint) < 200) {
            this._collisionPoint = this.plotAndBuild(
                this._collisionPoint, 60, 0,
            );
        }
    }

    private _kfIndex = 1;

    private _buildRelElapsedTime = 0;

    public plotAndBuild(curPos: THREE.Vector3, disLimit: number, timeOffset: number) {
        var keyframeArr = Globals.currentSong.keyframes;
        console.log(
            "next keyframe timestamp: " + keyframeArr[this._kfIndex].timestamp,
        );
        var deltaTime =
            keyframeArr[this._kfIndex].timestamp - this._buildRelElapsedTime;
        // keyframeArr[this.keyframeIndex].timestamp - this.elapsedTime - timeOffset;

        console.log(
            "elapsedTime: " +
            this._buildRelElapsedTime +
            ", deltatime: " +
            deltaTime,
        );

        const { x, y, z } =
            keyframeArr[this._kfIndex - 1].sceneParams.camera?.direction!;
        var direction = new THREE.Vector3(x!, y!, z!).normalize();

        var distance =
            (deltaTime / 1000) *
            keyframeArr[this._kfIndex - 1].sceneParams.camera?.relativeSpeed! *
            3;
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
            this._buildRelElapsedTime +=
                disLimit / (0.003 * keyframeArr[this._kfIndex - 1].sceneParams.camera?.relativeSpeed!);
            return destination;
        } else if (distance == disLimit) {
            console.log("distance was equal");
            // unlikely but just incase
            this.populate(curPos, destination);
            if (this._kfIndex < Globals.currentSong.keyframes.length) {
                this._kfIndex++;
            }
            this._buildRelElapsedTime +=
                disLimit / (0.003 * keyframeArr[this._kfIndex - 1].sceneParams.camera?.relativeSpeed!);
            return destination;
        } else {
            console.log("distance was smaller");
            this.populate(curPos, dirChange);
            if (this._kfIndex < Globals.currentSong.keyframes.length) {
                this._kfIndex++;
            }
            console.log("recurse");
            this._buildRelElapsedTime += deltaTime;
            return this.plotAndBuild(dirChange, disLimit - distance, deltaTime);
        }
    }

    public _onParamsChanged() { }

    private _lastKnownDirection = new THREE.Vector3(0, 0, 1);
    public populate(from: THREE.Vector3, to: THREE.Vector3) {
        console.log("populate func");
        console.log(from);
        console.log(to);
        var buildingSize = 15;

        var buildingGroup = new THREE.Group();

        var distance = from.distanceTo(to);
        var direction = new THREE.Vector3();
        direction.subVectors(to, from);
        direction.normalize();

        var localDirection = Math.sin(
            Math.asin(direction.x) - Math.asin(this._lastKnownDirection.x),
        );

        var compensation = Math.floor(localDirection * 4) * -buildingSize;
        console.log("compensation: " + compensation);

        var gridLength = Math.floor(distance / buildingSize) * buildingSize;

        for (let i = compensation; i < gridLength; i += (buildingSize + 1)) {
            // right side
            for (let j = -buildingSize - 5; j >= -((buildingSize + 1) * 4) - 5; j -= (buildingSize + 1)) {
                if (Math.random() > 0.3) {
                    let randBuilding = Math.floor(
                        Math.random() * this._buildingTypes.length,
                    );

                    var building = this._buildingTypes[randBuilding];
                    var buildingMesh = this._buildingGenerator.genBuilding(building);

                    buildingMesh.position.x = j;
                    buildingMesh.position.z = i;

                    buildingGroup.add(buildingMesh);
                }
            }
        }

        for (let i = -compensation; i < gridLength; i += (buildingSize + 1)) {
            // left side
            for (let k = buildingSize + 5; k <= ((buildingSize + 1) * 4) + 5; k += (buildingSize + 1)) {
                if (Math.random() > 0.3) {
                    let randBuilding = Math.floor(
                        Math.random() * this._buildingTypes.length,
                    );

                    var building = this._buildingTypes[randBuilding];
                    var buildingMesh = this._buildingGenerator.genBuilding(building);

                    buildingMesh.position.x = k;
                    buildingMesh.position.z = i;

                    buildingGroup.add(buildingMesh);
                }
            }
        }

        buildingGroup.position.copy(from);
        buildingGroup.lookAt(to);

        this._buildingGroups.push(buildingGroup);
        this._parentObject.add(buildingGroup);

        this._lastKnownDirection = direction;
    }

    public deleteBlock() {
        if (this._buildingGroups.length > 10) {
            var bG: THREE.Group = this._buildingGroups.shift()!;
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

    public songUpdate(time: number) {
        this.deleteBlock();
    }

    public setKeyframeIndex(index: number) {
        this._kfIndex = index;
    }

    public reset() {
        this._buildRelElapsedTime = 0;
        for (let i = 0; i < this._buildingGroups.length; i++) {
            this.purge(this._buildingGroups[i]);
        }
        this._collisionPoint = this.plotAndBuild(
            new THREE.Vector3(0, 0, 0),
            100,
            0,
        );
    }
}
