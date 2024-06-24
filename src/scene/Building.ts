import * as THREE from "three";

export class Building {
    public buildingBox: THREE.Mesh;
    public scale: THREE.Vector3;

    constructor(w: number, h: number, d: number) {
        this.scale = new THREE.Vector3(w, h, d);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        this.buildingBox = new THREE.Mesh(geometry, material);
        this.buildingBox.castShadow = true;
        this.buildingBox.receiveShadow = true;
    }

    public popup() {
        this.buildingBox.scale.lerp(this.scale, 0.02);
    }

    public getMesh() {
        return this.buildingBox;
    }

    public move(x: number, y: number, z: number) {
        this.buildingBox.translateX(x);
        this.buildingBox.translateY(y);
        this.buildingBox.translateZ(z);
    }

    public rotate(x: number, y: number, z: number) {
        this.buildingBox.rotateX(x);
        this.buildingBox.rotateY(y);
        this.buildingBox.rotateZ(z);
    }
}
