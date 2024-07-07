import * as THREE from "three";
import Globals from "../core/Globals";

// Each value is calculated as `offset + Math.random() * deviation`
export type Dist = { offset: number, deviation: number };
export type BuildingParams = {
    maxWidth: Dist, // max width
    maxHeight: Dist, // max "
    maxDepth: Dist, // max "
    widthSegments: number,
    heightSegments: number,
    depthSegments: number,
    twistFactor: Dist,
    baseHeightRatio: Dist, //  base height : max height
    baseRatio: Dist, // base width : max width
};

export class BuildingGenerator {
    constructor() {}

    private __worldPos = new THREE.Vector3();
    private _palette = Globals.sceneParams.palette;
    private _calcDist(dist: Dist): number {
        return dist.offset + (Math.random() * dist.deviation);
    }

    genBuilding(genParams: BuildingParams) {
        // if we ever wanna separate build base and build sections
        return this.buildBase(genParams);
    }

    public buildBase(genParams: BuildingParams) {
        this._palette = Globals.sceneParams.palette;

        var max_w = this._calcDist(genParams.maxWidth),
            max_h = this._calcDist(genParams.maxHeight),
            max_d = this._calcDist(genParams.maxDepth);

        var w = max_w * (1 - 0.2 * Math.random()),
            h = max_h * this._calcDist(genParams.baseHeightRatio),
            d = max_d * (1 - 0.2 * Math.random());

        console.log("building base")
        console.log("max building: ", max_w, max_h, max_d);
        console.log("base: ", w, h, d);

        var geometry = new THREE.BoxGeometry(
            w, h, d,
            genParams.widthSegments, genParams.heightSegments, genParams.depthSegments
        );

        // debug ----------------
        // var max_geo = new THREE.BoxGeometry(
        //     max_w, max_h, max_d,
        //     genParams.widthSegments, genParams.heightSegments, genParams.depthSegments
        // );
        //
        // var debug_mesh = new THREE.Mesh(
        //     max_geo,
        //     new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true })
        // );
        //
        // -----------------------

        var random = ['building1', 'building2', 'building3'];
        var randomTexture = random[Math.floor(Math.random() * random.length)];
        var texture = Globals.textures.getTexture(randomTexture);
        texture.repeat.set(genParams.widthSegments, genParams.heightSegments);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        var mesh = new THREE.Mesh(
            geometry,
            // new THREE.MeshStandardMaterial({ color: this._palette!.buildingTint, wireframe: false, map: texture })
            new THREE.MeshStandardMaterial({ color: this._palette!.buildingTint, wireframe: false})
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.y = h / 2;
        // debug_mesh.position.y = max_h / 2;

        var SectionGenParams = {
            ...genParams,
            maxWidth: { deviation: -w * 0.3, offset: w },
            maxHeight: { deviation: -max_h, offset: max_h },
            maxDepth: { deviation: -d * 0.3, offset: d },
        };

        this.buildSections(mesh, SectionGenParams, max_h);
        return mesh;
    }

    public buildSections(parent: THREE.Mesh, params: BuildingParams, max_height: number) {
        console.log("building sections")
        console.log(params);
        parent.getWorldPosition(this.__worldPos);
        parent.geometry.computeBoundingBox();

        var top = parent.geometry.boundingBox!.max;
        let y = this.__worldPos.y + top.y;
        if (y >= max_height) {
            console.log("top: ", y, "max: ", max_height);
            parent.parent?.remove(parent);
            return;
        }
        var m = this.buildSection(parent, params);
        this.buildSections(m, params, max_height);
    }

    public buildSection(parent: THREE.Mesh, params: BuildingParams) {

        parent.getWorldPosition(this.__worldPos);
        parent.geometry.computeBoundingBox();
        var top = parent.geometry.boundingBox!.max;

        let w = this._calcDist(params.maxWidth),
            h = this._calcDist(params.maxHeight),
            d = this._calcDist(params.maxDepth);

        let geometry = new THREE.BoxGeometry(
            w, h, d,
            params.widthSegments, params.heightSegments, params.depthSegments
        );

        var random = ['building1', 'building2', 'building3'];
        var randomTexture = random[Math.floor(Math.random() * random.length)];
        var texture = Globals.textures.getTexture(randomTexture);
        texture.repeat.set(params.widthSegments, params.heightSegments);
        let mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: this._palette?.buildingTint, wireframe: false})
            // new THREE.MeshStandardMaterial({ color: this._palette?.buildingTint, wireframe: false, map: texture })
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.set(0, top.y + h / 2, 0);

        let twist = this._calcDist(params.twistFactor);
        this._twist(twist, mesh);
        parent.add(mesh);

        console.log("section: ", w, h, d);

        return mesh;
    }

    private _twist(angle: number, m: THREE.Mesh) {
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
}

export const p_TwistyTower = () => {
    return {
        maxWidth: { offset: 15, deviation: -2 },
        maxHeight: { offset: 90, deviation: -10 },
        maxDepth: { offset: 15, deviation: -2 },
        widthSegments: 16,
        heightSegments: 16,
        depthSegments: 16,
        twistFactor: { offset: 5, deviation: -5 },
        baseHeightRatio: { offset: 0.2, deviation: -0.1 },
        baseRatio: { offset: 2, deviation: 0 },
    } as BuildingParams;
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

