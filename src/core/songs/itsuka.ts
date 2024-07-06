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
          direction: { x: 0, y: 0, z: 1 },
        },
        palette: {
          sky: "#0f12d2",
          fog: "#287493",
          ambientLight: "#aaaaaa",
          pointLight: "#ffffff",
          plane: "#555555",
          buildingTint: "#999999",
        },
      },
    },
    {
      timestamp: 1000,
      sceneParams: {
        camera: {
          direction: { x: 0, y: 0, z: 1 },
        },
        palette: {
          sky: "#ffffff",
          fog: "#287493",
          ambientLight: "#aaaaaa",
          pointLight: "#ffffff",
          plane: "#555555",
          buildingTint: "#999999",
        },
      },
    },
  ],
} as ISong;
