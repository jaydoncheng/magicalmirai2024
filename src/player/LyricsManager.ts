import Globals from "../core/Globals";
import { CharTex, CharTexMap, CharTexMapType } from "./CharTex";

export class LyricsManager {
    private _charTexMap: CharTexMap = new CharTexMap();

    constructor() {
    }

    public handleChar(c : string) {
        console.log(c);
        var a = this._charTexMap.getCharTex(c);

        Globals.three?.lyricsMng.placeChar(a);
    }
    
    private _prevWord: string = "";
    public handleWord(word: string) {
        if (this._prevWord === word) {
            return;
        }

        var c = word.split('');
        var l : CharTexMapType = {};
        for (var i = 0; i < c.length; i++) {
            l[c[i]] = this._charTexMap.getCharTex(c[i]);
            l[c[i]]._index = i;
            console.log(l[c[i]]._char + " " + l[c[i]]._index);
        }

        Globals.three?.lyricsMng.placeWord(l);
        this._prevWord = word;
    }

}
