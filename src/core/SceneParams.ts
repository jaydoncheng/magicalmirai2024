
export interface SceneParams {
    palette?: {
        sky?: string;
        fog?: string;
        ambientLight?: string;
        pointLight?: string;
        plane?: string;
        buildingTint?: string;
    }
    camera?: {
        sway?: () => void;
        direction?: { x?: number, y?: number, z?: number };
        relativeSpeed?: number;
    }
    map?: {
        scale?: number; // Scale everything by this factor
        roadWidth?: { min?: number, max?: number },
        buildings?: { // if we use prefab buildings i guess this is a scale factor
            width?: { min?: number, max?: number },
            height?: { min?: number, max?: number },
            depth?: { min?: number, max?: number },
        },
    }
}

// bro
export default {
    palette: {
        sky: "#87CEEB",
        fog: "#287493",
        ambientLight: "#aaaaaa",
        pointLight: "#ffffff",
        plane: "#555555",
        buildingTint: "#999999",
    },
    camera: {
        sway: () => { },
        direction: { x: 0, y: 0, z: 0 },
        relativeSpeed: 1,
    },
    map: {
        scale: 1,
        roadWidth: { min: 1, max: 1 },
        buildings: {
            width: { min: 1, max: 1 },
            height: { min: 1, max: 1 },
            depth: { min: 1, max: 1 },
        },
    }
} as SceneParams;
