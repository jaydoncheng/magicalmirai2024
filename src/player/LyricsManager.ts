import { CharTexMap } from "./CharTex";

export class LyricsManager {
    private _charTexMap: CharTexMap = new CharTexMap();
    constructor() {}
    
    public handleWord(word: string) {
        var c = word.split('');

        var l = {};
        for (var i = 0; i < c.length; i++) {
            l[c[i]] = this._charTexMap.getCharTex(c[i]);
        }

        return l;
    }

}
