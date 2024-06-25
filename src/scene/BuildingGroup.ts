import * as THREE from "three";
import { Building } from "./Building";

export class BuildingGroup {
    private _scene: THREE.Scene;
    private _colors: any;
    private _parent: THREE.Object3D;

    constructor(scene: THREE.Scene, colors: any) {
        this._scene = scene;
        this._colors = colors;
        this._parent = new THREE.Object3D();
    }

    public build(from: THREE.Vector3, to: THREE.Vector3) {
        const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: this._colors.plane,
            side: THREE.FrontSide,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.scale.set(32, 32, 1);
        plane.receiveShadow = true;
        plane.castShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._parent.add(plane);

        this.populate(from, to);

        this._parent.position.copy(from);
        this._parent.lookAt(to);
    }

    public populate(from: THREE.Vector3, to: THREE.Vector3) {
        // populate with buildings between from and to vector
        var distance = from.distanceTo(to);
        var direction = new THREE.Vector3();
        direction.subVectors(to, from);
        direction.normalize();
        var xCord = this.cordGen(-6, 6, 1.5, 3);
        var zCord = this.cordGen(0, distance, 0, 3);

        for (let i = 0; i < xCord.length; i++) {
            var building = new Building(1, Math.round(1 + Math.random() * 5), 1);
            var mesh = building.getBox();
            // mesh.position.copy(from);
            // mesh.position.add(to.clone().multiplyScalar(Math.random() * distance));

            mesh.position.z = zCord[i];

            mesh.position.y = 0;
            mesh.position.x = xCord[i];
            this.animate(building);
            this._parent.add(mesh);
        }
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
            throw new Error('for method "cordGen", l must be <= than 0');
        }

        if (r < 0) {
            throw new Error('for method "cordGen", r must be >= than 0');
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
