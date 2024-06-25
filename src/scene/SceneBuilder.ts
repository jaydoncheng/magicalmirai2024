import * as THREE from "three";
import { Building } from "./Building";
import { BuildingGroup } from "./BuildingGroup";

export class SceneBuilder {
    private _scene: THREE.Scene;
    private _colors: any;
    private buildings: Building[] = [];

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

        this.populate(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5));
    }

    public populate(from: THREE.Vector3, to: THREE.Vector3) {
        var buildingGroup = new BuildingGroup(this._scene, this._colors);
        buildingGroup.build(from, to);
    }

    public animate(building: Building) {
        if (building.buildingBox.scale.y <= building.scale.y - 1) {
            building.popup();
            requestAnimationFrame(() => this.animate(building));
        }
    }
}
