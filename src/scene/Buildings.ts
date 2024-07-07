import * as THREE from "three";
import {
    BuildingGenerator,
    type BuildingParams,
    p_TwistyTower,
} from "./Building";
import { SceneBase } from "./SceneBase";
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

        Globals.controls!.onStop(() => {
            this.reset();
        });
    }

    public update() { }

    private keyframeIndex = 1;

    private buildRelativeElapsedTime = 0;

    public plotAndBuild(
        curPos: THREE.Vector3,
        disLimit: number,
        timeOffset: number,
    ) {
        var keyframeArr = Globals.currentSong.keyframes;
        console.log(
            "next keyframe timestamp: " + keyframeArr[this.keyframeIndex].timestamp,
        );
        var deltaTime =
            keyframeArr[this.keyframeIndex].timestamp - this.buildRelativeElapsedTime;
        // keyframeArr[this.keyframeIndex].timestamp - this.elapsedTime - timeOffset;

        console.log(
            "elapsedTime: " +
            this.buildRelativeElapsedTime +
            ", deltatime: " +
            deltaTime,
        );

        const { x, y, z } =
            keyframeArr[this.keyframeIndex - 1].sceneParams.camera?.direction;
        var direction = new THREE.Vector3(x!, y!, z!).normalize();

        var distance =
            (deltaTime / 1000) *
            keyframeArr[this.keyframeIndex - 1].sceneParams.camera?.relativeSpeed! *
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
            this.buildRelativeElapsedTime +=
                disLimit / (0.003 * keyframeArr[this.keyframeIndex - 1].sceneParams.camera?.relativeSpeed!);
            return destination;
        } else if (distance == disLimit) {
            console.log("distance was equal");
            // unlikely but just incase
            this.populate(curPos, destination);
            if (this.keyframeIndex < Globals.currentSong.keyframes.length) {
                this.keyframeIndex++;
            }
            this.buildRelativeElapsedTime +=
                disLimit / (0.003 * keyframeArr[this.keyframeIndex - 1].sceneParams.camera?.relativeSpeed!);
            return destination;
        } else {
            console.log("distance was smaller");
            this.populate(curPos, dirChange);
            if (this.keyframeIndex < Globals.currentSong.keyframes.length) {
                this.keyframeIndex++;
            }
            console.log("recurse");
            this.buildRelativeElapsedTime += deltaTime;
            return this.plotAndBuild(dirChange, disLimit - distance, deltaTime);
        }
    }

    public _onParamsChanged() { }

    private __direction = new THREE.Vector3();
    private __dirNormal = new THREE.Vector3();

    private lastKnownDirection = new THREE.Vector3(0, 0, 1);

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
            Math.asin(direction.x) - Math.asin(this.lastKnownDirection.x),
        );

        var compensation = Math.floor(localDirection * 4) * -buildingSize;
        console.log("compensation: " + compensation);

        var gridLength = Math.floor(distance / buildingSize) * buildingSize;

        for (let i = compensation; i < gridLength; i += buildingSize) {
            // right side
            for (let j = -buildingSize * 4; j < -buildingSize; j += buildingSize) {
                if (Math.random() > 0.3) {
                    let randBuilding = Math.floor(
                        Math.random() * this.buildingTypes.length,
                    );

                    var building = this.buildingTypes[randBuilding];
                    var buildingMesh = this._buildingGenerator.genBuilding(building);

                    buildingMesh.position.x = j;
                    buildingMesh.position.z = i;

                    buildingGroup.add(buildingMesh);
                }
            }
        }

        for (let i = -compensation; i < gridLength; i += buildingSize) {
            // left side
            for (let k = buildingSize * 2; k < buildingSize * 5; k += buildingSize) {
                if (Math.random() > 0.3) {
                    let randBuilding = Math.floor(
                        Math.random() * this.buildingTypes.length,
                    );

                    var building = this.buildingTypes[randBuilding];
                    var buildingMesh = this._buildingGenerator.genBuilding(building);

                    buildingMesh.position.x = k;
                    buildingMesh.position.z = i;

                    buildingGroup.add(buildingMesh);
                }
            }
        }

        buildingGroup.position.copy(from);
        buildingGroup.lookAt(to);

        var center = new THREE.Vector3().copy(from);

        this.buildingGroups.push(buildingGroup);
        this._parentObject.add(buildingGroup);

        this.lastKnownDirection = direction;
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
        if (this.buildingGroups.length > 10) {
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
        this.deleteBlock();
    }

    public setKeyframeIndex(index: number) {
        this.keyframeIndex = index;
    }

    public reset() {
        this.buildRelativeElapsedTime = 0;
        for (let i = 0; i < this.buildingGroups.length; i++) {
            this.purge(this.buildingGroups[i]);
        }
    }
}
