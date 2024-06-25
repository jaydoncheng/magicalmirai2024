import * as THREE from "three";
import { Building } from "./Building";

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

        const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: this._colors.plane,
            side: THREE.FrontSide,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.scale.set(32, 3200, 1);
        plane.receiveShadow = true;
        plane.castShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);

        // for (let i = 0; i < 100; i++) {
        //     var building = new Building(1, Math.round(1 + Math.random() * 8), 1);
        //     var mesh = building.getMesh();
        //     mesh.position.x = Math.random() * 10 - 5;
        //     mesh.position.z = Math.random() * 100 - 50;
        //
        //     this.animate(building);
        //     this._scene.add(mesh);
        // }
        this.populate(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5));
    }

    public populate(from: THREE.Vector3, to: THREE.Vector3) {
        // populate with buildings between from and to vector
        var distance = from.distanceTo(to);
        var direction = new THREE.Vector3();
        direction.subVectors(to, from);
        direction.normalize();
        // var xCord = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6];
        // var xCord = [9, -7, -5, -3, -1, 1, 3, 5, 7, 9];
        var xCord = this.cordGen(-6, 6, 1.5, 3);

        for (let i = 0; i < xCord.length; i++) {
            var building = new Building(1, Math.round(1 + Math.random() * 5), 1);
            var mesh = building.getBox();
            mesh.position.copy(from);
            mesh.position.add(to.clone().multiplyScalar(Math.random() * distance));

            mesh.position.y = 0;
            mesh.position.x = xCord[i];
            // mesh.position.x += Math.random() * 10 - 5;
            // if (mesh.position.x > -1 && mesh.position.x < 1) {
            //     mesh.position.x = mesh.position.x < 0 ? -2 : 2;
            // }
            this.animate(building);
            this._scene.add(mesh);
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
