import * as THREE from "three";

export class Building {
    public buildingBox: THREE.Object3D;
    public buildingMesh: THREE.Mesh;
    public scale: THREE.Vector3;

    constructor(w: number, h: number, d: number) {
        this.scale = new THREE.Vector3(w, h, d);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        this.buildingMesh = new THREE.Mesh(geometry, material);
        this.buildingMesh.castShadow = true;
        this.buildingMesh.receiveShadow = true;
        this.buildingMesh.position.set(0, 0.5, 0);
        this.buildingBox = new THREE.Object3D();
        this.buildingBox.add(this.buildingMesh);
    }

    public popup() {
        this.buildingBox.scale.lerp(this.scale, 0.02);
    }

    public getBox() {
        return this.buildingBox;
    }

    public rotate(x: number, y: number, z: number) {
        this.buildingBox.rotateX(x);
        this.buildingBox.rotateY(y);
        this.buildingBox.rotateZ(z);
    }
}
