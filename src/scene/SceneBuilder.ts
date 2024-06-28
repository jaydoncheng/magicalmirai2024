import * as THREE from "three";

export class SceneBuilder {
    private _scene: THREE.Scene;
    private _colors: any;
    private _floor: THREE.Mesh;

    constructor(scene: THREE.Scene, colors: any) {
        this._scene = scene;
        this._colors = colors;
    }

    public build() {
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
    }

    public getPlane() {
        return this._floor;
    }

}
