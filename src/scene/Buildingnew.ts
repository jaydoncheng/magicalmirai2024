import * as THREE from "three";
import { SceneBase } from "./SceneBase";

type iHateWritingThis = { val: number, dev: number };

type BuildingParams = {
    width: iHateWritingThis, // max width
    height: iHateWritingThis, // max "
    depth: iHateWritingThis, // max "
    widthSegments: number,
    heightSegments: number,
    depthSegments: number,
    twistFactor: iHateWritingThis,
    baseRatio: number,

};

export class BuildingNew extends SceneBase {

    public _width: iHateWritingThis;
    public _height: iHateWritingThis;
    public _depth: iHateWritingThis;

    public _widthSegments: number;
    public _heightSegments: number;
    public _depthSegments: number;
    public _genParams: BuildingParams;

    constructor(
        parentObject: THREE.Object3D,
        width: iHateWritingThis,
        height: iHateWritingThis,
        depth: iHateWritingThis,
        widthSegments: number = 1,
        heightSegments: number = 1,
        depthSegments: number = 1,
        genParams: BuildingParams
    ) {
        super(parentObject);
        this._width = width;
        this._height = height;
        this._depth = depth;
        this._widthSegments = widthSegments;
        this._heightSegments = heightSegments;
        this._depthSegments = depthSegments;
        this._genParams = { ...genParams };
    }

    base(genParams?: BuildingParams) {
        var w = this._width.val + Math.random() * this._width.dev,
            h = this._height.val + Math.random() * this._height.dev,
            d = this._depth.val + Math.random() * this._depth.dev;

        var geometry = new THREE.BoxGeometry(
            w, h, d,
            this._widthSegments, this._heightSegments, this._depthSegments
        );

        var mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: false })
        );

        this._parentObject.add(mesh);
        mesh.position.set(-1, h / 2, -2);

        this.build(mesh, genParams || this._genParams);

        return mesh;
    }

    private __worldPos = new THREE.Vector3();
    build(parent: THREE.Mesh, params: BuildingParams) {
        parent.getWorldPosition(this.__worldPos);
        parent.geometry.computeBoundingBox();

        var top = parent.geometry.boundingBox!.max;
        let y = this.__worldPos.y + top.y;
        if (y > params.height.val * 4) return;

        let h = params.height.val + Math.random() * params.height.dev;

        let geometry = new THREE.BoxGeometry(
            params.width.val + Math.random() * params.width.dev,
            h,
            params.depth.val + Math.random() * params.depth.dev,
            params.widthSegments, params.heightSegments, params.depthSegments
        );

        let mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: false })
        );

        // place at center of parent object
        mesh.position.set(0, top.y + h / 2 - 0.2, 0);

        let twist = params.twistFactor.val + (Math.random() * 2 - 1) * params.twistFactor.dev;
        this.twist(twist, mesh);
        parent.add(mesh);
        params.width.val -= Math.random() * 2 * params.width.dev;
        params.depth.val -= Math.random() * 2 * params.depth.dev;
        this.build(mesh, params);
    }

    private twist(angle: number, m: THREE.Mesh) {
        var og = m.clone();
        var pos = m.geometry.getAttribute("position");
        var ogpos = og.geometry.getAttribute("position");

        var nor = m.geometry.getAttribute("normal");
        var ognor = og.geometry.getAttribute("normal");

        var p = angle * Math.PI / 180;

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

    }

    // unused?
    public initialize() {
        this.base();
    }

    public _onParamsChanged(params: any) {

    }

}

export const p_TwistyTower = () => {
    return {
        width: { val: 3, dev: 0.1 },
        height: { val: 8, dev: 8 },
        depth: { val: 3, dev: 0.1 },
        widthSegments: 1,
        heightSegments: 16,
        depthSegments: 1,
        twistFactor: { val: 1, dev: 10 }
    };
}

export const p_BlockyTower = () => {
    return {
        width: { val: 3, dev: 2 },
        height: { val: 8, dev: 8 },
        depth: { val: 3, dev: 2 },
        widthSegments: 1,
        heightSegments: 16,
        depthSegments: 1,
        twistFactor: { val: 0, dev: 0 }
    };
}

