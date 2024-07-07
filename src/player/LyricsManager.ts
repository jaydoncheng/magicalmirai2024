import Globals from "../core/Globals";
import { CharTex, CharTexMap, CharTexMapType } from "./CharTex";

export class LyricsManager {
    private _charTexMap: CharTexMap = new CharTexMap();
    constructor() {}
    
    public handleWord(word: string) {
        var c = word.split('');

        var l : CharTexMapType = {};
        for (var i = 0; i < c.length; i++) {
            l[c[i]] = this._charTexMap.getCharTex(c[i]);
        }

        Globals.three?.placeLyrics(l);
        return l;
    }

}
