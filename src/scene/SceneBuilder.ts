import * as THREE from 'three';
import { Building } from './Building';

export class SceneBuilder {
    private _scene: THREE.Scene;
    private _colors : any;
    private buildings : Building[] = [];

    constructor(scene : THREE.Scene, colors : any) { 
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

        for (let i = 0; i < 10; i++) {
            var building = new Building(1, Math.round(1 + Math.random() * 10), 1);
            var mesh = building.getMesh();
            mesh.position.copy(from);
            mesh.position.add(to.clone().multiplyScalar(Math.random() * distance));

            mesh.position.y = 1;
            mesh.position.x += Math.random() * 10 - 5;
            if (mesh.position.x > -1 && mesh.position.x < 1) {
                mesh.position.x = mesh.position.x < 0 ? -2 : 2;
            }
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
}
