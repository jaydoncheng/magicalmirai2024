import * as THREE from "three";
import { Building } from "./Building";
import { SceneBase } from "./SceneBase";

export class Buildings extends SceneBase {

    private buildingBlocks: THREE.Object3D[] = [];

    constructor(_parentObject: THREE.Object3D) {
        super(_parentObject);
    }

    public initialize() {
        // implement later
    }

    public update() {
        // implement later
    }

    public _onParamsChanged(params: any) {}

    public populate(from: THREE.Vector3, to: THREE.Vector3) {
        var _parent = new THREE.Object3D();
        // populate with buildings between from and to vector
        var distance = from.distanceTo(to);
        var direction = new THREE.Vector3();
        direction.subVectors(to, from);
        direction.normalize();
        console.log("distance: " + distance);

        for (let i = 0; i < 10; i++) {
            var building = new Building(1, Math.round(1 + Math.random() * 10), 1);
            var mesh = building.getBox();
            mesh.position.copy(from);
            mesh.position.z += Math.random() * distance;

            mesh.position.y = 0;
            mesh.position.x += Math.random() * 10 - 5;
            if (mesh.position.x > -1 && mesh.position.x < 1) {
                mesh.position.x = mesh.position.x < 0 ? -2 : 2;
            }

            this.animate(building);
            _parent.add(mesh);
        }
        _parent.position.copy(from);
        _parent.lookAt(to);
        this._parentObject.add(_parent);
        this.buildingBlocks.push(_parent);
    }

    public animate(building: Building) {
        if (building.buildingBox.scale.y <= building.scale.y - 1) {
            console.log("animating");

            building.popup();
            requestAnimationFrame(() => this.animate(building));
        }
    }

    public deleteBlock() {
        var thisBuilding: THREE.Object3D = this.buildingBlocks.shift();
        this.purge(thisBuilding);
    }

    public purge(obj) {
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
