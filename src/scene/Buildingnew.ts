// Buildings will be constructed from a
// BufferGeometry class where each vertex is a corner of a building.
// The buildings will then be constructed by edges and faces.

// parameters:
// width, height, depth
// widthSegments, heightSegments, depthSegments (the lines inbetween the windows)
// skewX, skewZ
// ledgeFactor, ledgeScale
// randomizeFactor

// The building will have a roof and a base.
// The base will be a separate object
// These custom geometries can be stacked on top of each other to create "balconies"
import * as THREE from "three";
import Globals from "../core/Globals";
import { SceneBase } from "./SceneBase";

export class BuildingNew extends SceneBase {

    public _width: { val: number, dev: number };
    public _height: { val: number, dev: number };
    public _depth: { val: number, dev: number };

    public _widthSegments: number;
    public _heightSegments: number;
    public _depthSegments: number;

    public _skewX: { val: number, dev: number };
    public _skewZ: { val: number, dev: number };
    public _ceilingRotation: { deg: number, dev: number };

    public _ledgeFactor: number;
    public _ledgeScale: number;

    constructor(
        parentObject: THREE.Object3D,
        width: { val: number, dev: number },
        height: { val: number, dev: number },
        depth: { val: number, dev: number },
        widthSegments: number = 1,
        heightSegments: number = 1,
        depthSegments: number = 1,
        skewX: { val: number, dev: number } = { val: 0, dev: 0 },
        skewZ: { val: number, dev: number } = { val: 0, dev: 0 },
        ceilingRotation: { deg: number, dev: number } = { deg: 0, dev: 0 },
        ledgeFactor: number = 0.1,
        ledgeScale: number = 0.1
    ) {
        super(parentObject);
        this._width = width;
        this._height = height;
        this._depth = depth;
        this._widthSegments = widthSegments;
        this._heightSegments = heightSegments;
        this._depthSegments = depthSegments;
        this._skewX = skewX;
        this._skewZ = skewZ;
        this._ceilingRotation = ceilingRotation;
        this._ledgeFactor = ledgeFactor;
        this._ledgeScale = ledgeScale;
    }

    // recursive
    build(parent: THREE.Object3D) {
    }

    private cube: THREE.Mesh;
    private copy: THREE.Mesh;
    generateGeometry() {
        if (this.cube) {
            this._parentObject.remove(this.cube);
        }

        var w = Globals.sceneParams.cube!.width;
        var h = Globals.sceneParams.cube!.height;
        var d = Globals.sceneParams.cube!.depth;

        var boxGeometry = new THREE.BoxGeometry(
            w, h, d,
            this._widthSegments, Globals.sceneParams.cube!.heightSegments, this._depthSegments
        );

        var mesh = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true })
        );
        this.cube = mesh;
        this.copy = mesh.clone();

        mesh.position.set(-2, 0, -5);
        this._parentObject.add(mesh);
    }

    private twist(p : number) {
        var pos = this.cube.geometry.getAttribute("position");
        var ogpos = this.copy.geometry.getAttribute("position");

        var nor = this.cube.geometry.getAttribute("normal");
        var ognor = this.copy.geometry.getAttribute("normal");

        for (let i = 0; i < pos.count; i++) {
            var x = ogpos.getX(i),
                y = pos.getY(i),
                z = ogpos.getZ(i);

            var nx = ognor.getX(i),
                ny = nor.getY(i),
                nz = ognor.getZ(i);

            var alpha = Math.sin(p) * y,
                cos = Math.cos(alpha),
                sin = Math.sin(alpha);

            pos.setXYZ(i, x * cos - z * sin, y, x * sin + z * cos);
            nor.setXYZ(i, nx * cos - nz * sin, ny, nx * sin + nz * cos);
        }
    }

    public update() {
        // this._parentObject.position.x += 0.01;
    }

    public initialize() {}

    public _onParamsChanged(params: any) {
        this._width = Globals.sceneParams.cube!.width;
        this._height = Globals.sceneParams.cube!.height;
        this._depth = Globals.sceneParams.cube!.depth;

        this.generateGeometry();
        this.twist(Globals.sceneParams.cube!.twistAlpha);
    }

}
