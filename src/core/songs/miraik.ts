import { ISong } from "../ISong";

export default {
    songName: "未来交響曲",
    songArtist: "ヤマギシコージ",
    songUrl: "https://piapro.jp/t/Rejk/20240202164429",
    video: {
        beatId: 4592298,
        chordId: 2727638,
        repetitiveSegmentId: 2824322,
        lyricId: 59418,
        lyricDiffId: 13965
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
                    sky: "#798dd4",
                    fog: "#adcff6",
                    ambientLight: "#aaaaaa",
                    pointLight: "#ffffff",
                    plane: "#555555",
                    buildingTint: "#ffec99",
                },
            }
        },
    ]
} as ISong;
