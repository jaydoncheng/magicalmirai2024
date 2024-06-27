import { SceneParams } from "./SceneParams";

export interface ISong {
    songName: string;
    songArtist: string;
    songUrl: string;
    video: any;
    keyframes?: { [timestamp: string] : SceneParams };
}
