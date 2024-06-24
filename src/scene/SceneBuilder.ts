import * as THREE from 'three';

export class SceneBuilder {
    private _scene: THREE.Scene;
    private _colors : any;

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

        for (let i = 0; i < 1000; i++) {
            const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
            const boxMaterial = new THREE.MeshPhongMaterial({ color: this._colors.box });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            var x = Math.random() * 20 - 10;
            var z = Math.random() * 300;
            if (x > -1 && x < 1) {
                x = x > 0 ? 1 : -1;
                box.material.color.setHex(0xff0000);
            }
            box.scale.set(1, 1 + Math.random() * 8, 1);
            box.position.set(x, 0.5, -z + 10);
            box.castShadow = true;
            box.receiveShadow = true;
            this._scene.add(box);
        }
    }
}
