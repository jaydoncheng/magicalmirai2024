import * as THREE from 'three';

export class CameraManager {

    private _camera: THREE.Camera;
    private camParent: THREE.Group;
    private camSubParent: THREE.Group; // takes the camera target into account
    private cameraTarget: THREE.Vector3;
    private camHelper: THREE.Vector3;
    private fakeCam: THREE.Camera;
    private direction: number;
    private startingPos: THREE.Vector3;
    constructor() {}

    public initialize() {
        this._camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this._camera.position.set(0, 1, -0.001);

        this.cameraTarget = new THREE.Vector3(0, 1, 0);
        // offset target to replicate first person
        this.camHelper = new THREE.Vector3();

        this.camSubParent = new THREE.Group();
        this.camParent = new THREE.Group();
        this.camSubParent.add(this._camera);
        this.camParent.add(this.camSubParent);
        this._scene.add(this.camParent);

        this.fakeCam = this._camera.clone();
        this._controls = new OrbitControls(this.fakeCam, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;

        this._controls.target = this.cameraTarget;
        this._controls.update;
        this._camera.copy(this.fakeCam);

        this.camParent.add(this._sceneBuilder.getPlane());

    }

}
