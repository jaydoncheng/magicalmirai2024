import * as THREE from "three";

export class Building {
  public buildingBox: THREE.Mesh;

  constructor(w: number, h: number, d: number) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    this.buildingBox = new THREE.Mesh(geometry, material);
    this.buildingBox.castShadow = true;
    this.buildingBox.receiveShadow = true;
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
