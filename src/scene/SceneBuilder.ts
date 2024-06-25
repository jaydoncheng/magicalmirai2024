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

    public cordGen(l, r, gap, n) {
        // to make a randomizer without duplicates, im using a shuffling an array of nums and just
        // incrementing the index i take a number from after each number is picked.
        // l is amount of buildings on left
        // r is amount on right
        // g is the gap inbetween
        // n is the amount of times the numbers are shuffled, more shuffles creates better results.

        if (l > 0) {
            throw new Error('for method "cordGen", l must be smaller than 0');
        }

        if (r < 0) {
            throw new Error('for method "cordGen", r must be bigger than 0');
        }

        let arr: number[] = [];
        for (let m: number = l; m < 0; m++) {
            arr.push(m + 0.5 - gap * 0.5);
        }

        for (let m: number = 1; m <= r; m++) {
            arr.push(m - 0.5 + gap * 0.5);
        }

        console.log(arr);

        if (n <= 0) {
            // amount of shuffles should ATLEAST be 1
            n = 1;
        }

        for (let k = 0; k < n; k++) {
            for (let i = arr.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        console.log(arr);

        return arr;
    }
}
