import { Player, IVideo } from 'textalive-app-api'

export class PlayerManager {
    private _player: Player;
    private _video: IVideo;

    constructor() {
        const media: HTMLElement | null = document.querySelector("#media");
        if (media === null) {
            throw new Error("media element not found");
        }

        const controlPlay: HTMLElement | null = document.querySelector("#bt_play");
        const controlStop: HTMLElement | null = document.querySelector("#bt_rewind");
        if (controlPlay === null || controlStop === null) {
            throw new Error("control element not found");
        }
        /* 再生・一時停止ボタン */
        controlPlay.addEventListener("click", (e) => {
            e.preventDefault();
            if (player) {
                if (player.isPlaying) {
                    player.requestPause();
                } else {
                    player.requestPlay();
                }
            }
            return false;
        });

        /* 停止ボタン */
        controlStop.addEventListener("click", (e) => {
            e.preventDefault();
            if (player) {
                player.requestStop();

                // 再生を停止したら画面表示をリセットする
            }
            return false;
        });

        var player = this._player = new Player({
            app: { token: "U0WiRzyOIaolhCks" },
            mediaElement: media,
            mediaBannerPosition: "bottom right"
        });

        player.addListener({
            onAppReady(app) {
                if (!app.songUrl) {
                    media.className = "disabled";

                    // SUPERHERO / めろくる
                    player.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028", {
                        video: {
                            // 音楽地図訂正履歴
                            beatId: 4592293,
                            chordId: 2727635,
                            repetitiveSegmentId: 2824326,
                            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
                            lyricId: 59415,
                            lyricDiffId: 13962
                        }
                    });
                }
            },

            onVideoReady(v) {
                console.log("onVideoReady", v);
                let w = player.video.firstWord;
                console.log("firstWord", w);
                while (w) {
                    w.animate = function(now, unit) {
                        console.log("animate", now, unit);
                    }
                    w = w.next;
                }
            },

            onTimeUpdate(time) {
                console.log("onTimeUpdate", time);
                let beat = player.findBeat(time);
                if (beat) {
                }

            },

            onPlay() {
                console.log("onPlay");
            },

            onPause() {
                console.log("onPause");
            }
        });

    }

}
