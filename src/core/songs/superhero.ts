import { ISong } from "../ISong";

export default {
    songName: "SUPERHERO",
    songArtist: "めろくる",
    songUrl: "https://piapro.jp/t/hZ35/20240130103028",
    video: {
        beatId: 4592293,
        chordId: 2727635,
        repetitiveSegmentId: 2824326,
        lyricId: 59415,
        lyricDiffId: 13962
    },
    keyframes: [
        {
            timestamp: 0,
            sceneParams: {
                camera: {
                    sway: 1,
                    direction: { x: 0, y: 0, z: 1 },
                    relativeSpeed: 2,
                },
                palette: {
                    sky: "#ffd43b",
                    fog: "#6b57dc",
                    ambientLight: "#aaaaaa",
                    pointLight: "#ffffff",
                    plane: "#555555",
                    buildingTint: "#a9e3f4",
                },
            } 
        },
    ]
} as ISong;
