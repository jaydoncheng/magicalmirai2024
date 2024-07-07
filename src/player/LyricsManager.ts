import Globals from "../core/Globals";
import { CharTex, CharTexMap, CharTexMapType } from "./CharTex";

export class LyricsManager {
    private _charTexMap: CharTexMap = new CharTexMap();
    constructor() {
    }

    private _prevPhrase: string = "";
    public handlePhrase(phrase: string) {

        if (phrase === this._prevPhrase) return;
        console.log("handlePhrase", phrase);
        // Globals.three?.lyricsMng.newCameraTarget();

        this._prevPhrase = phrase;
    }

    public handleChar(c : string) {
        var l : CharTexMapType = {};
        l[c] = this._charTexMap.getCharTex(c);
        // this._sceneLyrics.placeLyrics(l);
        return l;
    }
    
    public handleWord(word: string) {
        var c = word.split('');

        var l : CharTexMapType = {};
        for (var i = 0; i < c.length; i++) {
            l[c[i]] = this._charTexMap.getCharTex(c[i]);
        }

        // this._sceneLyrics.placeLyrics(l);
        return l;
    }

}
