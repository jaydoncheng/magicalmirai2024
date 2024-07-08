import { ISong } from "../ISong";

export default {
    songName: "フューチャーノーツ",
    songArtist: "shikisai",
    songUrl: "https://piapro.jp/t/XiaI/20240201203346",
    video: {
        beatId: 4592297,
        chordId: 2727637,
        repetitiveSegmentId: 2824328,
        lyricId: 59417,
        lyricDiffId: 13964,
    },
    keyframes: [
        {
            timestamp: 0,
            sceneParams: {
                camera: {
                    sway: () => { },
                    direction: { x: 0, y: 0, z: 1 },
                    relativeSpeed: 2,
                },
                palette: {
                    sky: "#99e9f2",
                    fog: "#f783ac",
                    ambientLight: "#aaaaaa",
                    pointLight: "#ffffff",
                    plane: "#555555",
                    buildingTint: "#ffd43b",
                },
            },
        },
        {
            timestamp: 11452,
            sceneParams: {
                camera: {
                    sway: () => { },
                    direction: { x: 0.5, y: 0, z: 1 },
                    relativeSpeed: 5,
                },
            },
        },
        {
            timestamp: 21656,
            sceneParams: {
                camera: {
                    sway: () => { },
                    direction: { x: -0.5, y: 0, z: 1 },
                    relativeSpeed: 3,
                },
            },
        },
        {
            timestamp: 34450,
            sceneParams: {
                camera: {
                    sway: () => { },
                    direction: { x: 1, y: 0, z: 1 },
                    relativeSpeed: 13,
                },
            },
        },
        {
            timestamp: 42045,
            sceneParams: {
                camera: {
                    sway: () => { },
                    direction: { x: 0.5, y: 0, z: 1 },
                    relativeSpeed: 13,
                },
            },
        },
        {
            timestamp: 1000000,
            sceneParams: {
                camera: {
                    sway: () => { },
                    direction: { x: 0, y: 0, z: 1 },
                    relativeSpeed: 2,
                },
            },
        },
    ],
} as ISong;
