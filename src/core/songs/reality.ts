import { ISong } from "../ISong";

export default {
    songName: "リアリティ",
    songArtist: "歩く人",
    songUrl: "https://piapro.jp/t/ELIC/20240130010349",
    video: {
        beatId: 4592299,
        chordId: 2727639,
        repetitiveSegmentId: 2824330,
        lyricId: 59419,
        lyricDiffId: 13966
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
                    sky: "#a36894",
                    fog: "#ff95a5",
                    ambientLight: "#aaaaaa",
                    pointLight: "#ffffff",
                    plane: "#555555",
                    buildingTint: "#bd6a4e",
                },
            }
        },
    ]
} as ISong;
