import Globals from "../core/Globals";
import { CharTexMap, CharTexMapType } from "./CharTex";

export class LyricsManager {
    private _charTexMap: CharTexMap = new CharTexMap();

    constructor() {
        Globals.controls!.onStop(() => {
            console.log("resetting lyrics");
            this._reset();
        });
    }

    private _reset() {
        this._charTexMap.dispose();
    }

    public handleChar(c : string) {
        var a = this._charTexMap.getCharTex(c);
        Globals.three?.lyricsMng.placeChar(a);
    }
    
    public handleWord(word: string) {
        console.log("handling word", word);
        var c = word.split('');
        var l : CharTexMapType = {};
        for (var i = 0; i < c.length; i++) {
            l[c[i]] = this._charTexMap.getCharTex(c[i]);
            l[c[i]]._index = i;
        }

        Globals.three?.lyricsMng.placeWord(l);
    }
}
