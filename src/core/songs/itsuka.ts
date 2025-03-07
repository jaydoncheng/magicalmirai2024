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
    lyricDiffId: 13963,
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
          fog: "#3bc9db",
          ambientLight: "#aaaaaa",
          pointLight: "#ffffff",
          plane: "#555555",
          buildingTint: "#242253",
        },
      },
    }
  ],
} as ISong;
