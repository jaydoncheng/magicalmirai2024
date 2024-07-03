import { ISong } from "../ISong";

export default {
    songName: "いつか君と話したミライは",
    songArtist: "タケノコ少年",
    songUrl: "https://piapro.jp/t/--OD/20240202150903",
    video: {
        beatId: 4592296,
        chordId: 2727636,
        repetitiveSegmentId: 2824327,
        lyricId: 59416,
        lyricDiffId: 13963
    },
    keyframes: [
        {
            timestamp: 0,
            sceneParams: {
                palette: {
                    sky: "#87CE00",
                    fog: "#287493",
                    ambientLight: "#aaaaaa",
                    pointLight: "#ffffff",
                    plane: "#555555",
                    buildingTint: "#999999",
                },
            } 
        },
        {
            timestamp: 1000,
            sceneParams: {
                palette: {
                    sky: "#ffffff",
                    fog: "#287493",
                    ambientLight: "#aaaaaa",
                    pointLight: "#ffffff",
                    plane: "#555555",
                    buildingTint: "#999999",
                },
            } 
        },
    ]
} as ISong;
