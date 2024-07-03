import { ISceneParams } from "./SceneParams";

export type Keyframe = {
    timestamp: number;
    sceneParams: ISceneParams;
}

export interface ISong {
    songName: string;
    songArtist: string;
    songUrl: string;
    video: any;
    keyframes: Keyframe[];
}


