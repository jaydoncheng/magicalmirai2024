import * as THREE from "three";
import { Object3D } from "three";
import { Building } from "./Building";

export class SceneBuilder {
    private _scene: THREE.Scene;
    private _colors: any;
    private _floor: THREE.Mesh;
    private buildingBlocks: Object3D[] = [];

    constructor(scene: THREE.Scene, colors: any) {
        this._scene = scene;
        this._colors = colors;
    }

    public build() {
        this._scene.background = new THREE.Color(this._colors.sky);
        const fog = new THREE.Fog(this._colors.fog, 0.015, 100);
        this._scene.fog = fog;

        const alight = new THREE.AmbientLight(this._colors.ambientLight, 0.1);
        alight.position.set(0, 1, 0);
        this._scene.add(alight);

        var plight = new THREE.PointLight(this._colors.pointLight, 1, 50, 5);
        plight.position.set(0, 5, 0);
        plight.castShadow = true;
        plight.shadow.bias = 0.00001;
        this._scene.add(plight);

        const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: this._colors.plane,
            side: THREE.FrontSide,
        });
        this._floor = new THREE.Mesh(planeGeometry, planeMaterial);
        this._floor.scale.set(32, 320, 1);
        this._floor.receiveShadow = true;
        this._floor.castShadow = true;
        this._floor.rotation.x = -Math.PI / 2;

        this.populate(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5));
    }

    public getPlane() {
        return this._floor;
    }

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
        this._scene.add(_parent);
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
