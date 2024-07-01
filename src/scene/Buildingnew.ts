import * as THREE from "three";
import { SceneBase } from "./SceneBase";

// Each value is calculated as `offset + Math.random() * deviation`
type Dist = { offset: number, deviation: number };

type BuildingParams = {
    width: Dist, // max width
    height: Dist, // max "
    depth: Dist, // max "
    widthSegments: number,
    heightSegments: number,
    depthSegments: number,
    twistFactor: Dist,
    baseHeightRatio: Dist, // ratio of base height to max height
    baseRatio: Dist //  base width : depth
};

export class BuildingNew extends SceneBase {
    constructor(
        parentObject: THREE.Object3D,
    ) {
        super(parentObject);
    }

    private _calcDist(dist: Dist) : number {
        return dist.offset + (Math.random() * dist.deviation);
    }

    base(genParams: BuildingParams) {
        var max_w = this._calcDist(genParams.width),
            max_h = this._calcDist(genParams.height),
            max_d = this._calcDist(genParams.depth);

        var w = max_w,
            h = max_h * this._calcDist(genParams.baseHeightRatio),
            d = max_d;

        console.log("max building: ", max_w, max_h, max_d);
        console.log("base: ", w, h, d);

        var geometry = new THREE.BoxGeometry(
            w, h, d,
            genParams.widthSegments, genParams.heightSegments, genParams.depthSegments
        );

        // debug ----------------
        var max_geo = new THREE.BoxGeometry(
            max_w, max_h, max_d,
            genParams.widthSegments, genParams.heightSegments, genParams.depthSegments
        );

        var debug_mesh = new THREE.Mesh(
            max_geo,
            new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true })
        );

        // -----------------------

        var mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: false })
        );

        this._parentObject.add(mesh);
        mesh.position.y = h/2;
        this._parentObject.add(debug_mesh);
        debug_mesh.position.y = max_h/2;

        var SectionGenParams = { ...genParams,
            width: {  deviation: -w, offset: w },
            height: { deviation: -max_h, offset: max_h - h },
            depth: { deviation: -d, offset: d },
        };
        this.buildSections(mesh, SectionGenParams, max_h);

        return { mesh, debug_mesh };
    }

    private buildSections(parent: THREE.Mesh, params: BuildingParams, max_height: number) {
        parent.getWorldPosition(this.__worldPos);
        parent.geometry.computeBoundingBox();

        var top = parent.geometry.boundingBox!.max;
        let y = this.__worldPos.y + top.y;
        if (y >= max_height) {
            console.log("max height reached");
            console.log("top: ", y, "max: ", max_height);
            console.log("im tired dawg, just delete it");
            parent.parent?.remove(parent);
            return;
        }
        var m = this.buildSection(parent, params);
        this.buildSections(m, params, max_height);
    }

    private __worldPos = new THREE.Vector3();
    buildSection(parent: THREE.Mesh, params: BuildingParams) {

        parent.getWorldPosition(this.__worldPos);
        parent.geometry.computeBoundingBox();
        var top = parent.geometry.boundingBox!.max;

        let w = this._calcDist(params.width),
            h = this._calcDist(params.height),
            d = this._calcDist(params.depth);

        let geometry = new THREE.BoxGeometry(
            w, h, d,
            params.widthSegments, params.heightSegments, params.depthSegments
        );

        let mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false })
        );

        // place at center top of parent object
        mesh.position.set(0, top.y + h / 2, 0);

        let twist = this._calcDist(params.twistFactor);
        this.twist(twist, mesh);
        parent.add(mesh);

        console.log("section: ", w, h, d);

        return mesh;
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
    }

    public _onParamsChanged(params: any) {

    }

}


export const p_TwistyTower = () => {
    return {
        width: { offset: 10, deviation: 0 },
        height: { offset: 80, deviation: 0 },
        depth: { offset: 10, deviation: 0 },
        widthSegments: 1,
        heightSegments: 16,
        depthSegments: 1,
        twistFactor: { offset: 0, deviation: 90 },
        baseRatio: { offset: 0.1, deviation: 0.1 }
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

