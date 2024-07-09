import { ISong } from "../ISong";

export default {
    songName: "The Marks",
    songArtist: "2ouDNS",
    songUrl: "https://piapro.jp/t/xEA7/20240202002556",
    video: {
        beatId: 4592300,
        chordId: 2727640,
        repetitiveSegmentId: 2824331,
        lyricId: 59420,
        lyricDiffId: 13967
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
                    sky: "#0f12d2",
                    fog: "#1e1e1e",
                    ambientLight: "#aaaaaa",
                    pointLight: "#ffffff",
                    plane: "#555555",
                    buildingTint: "#7950f2",
                },
            }
        },
    ]
} as ISong;
