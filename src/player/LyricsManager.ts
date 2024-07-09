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

    private _isAlnum(str: string) {
        var code: number,
            i: number,
            len: number;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // (0-9)
                !(code > 64 && code < 91) && // (A-Z)
                !(code > 96 && code < 123)) { // (a-z)
                return false;
            }
        }
        return true;
    }

    public handleChar(c: string) {
        Globals.three?.lyricsMng.placeChar(c);
    }

    public handleWord(word: string) {
        var c = word.split('');
        var l: CharTexMapType = [];
        for (var i = 0; i < c.length; i++) {
            l.push(this._charTexMap.newCharTex(c[i], i));
        }

        Globals.three?.lyricsMng.placeWord(l);

        // If word is alphanumeric, place the whole word instead of animating
        if (this._isAlnum(word)) {
            for (var i = 0; i < c.length; i++) this.handleChar(c[i]);
        }
    }
}
