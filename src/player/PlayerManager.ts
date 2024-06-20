import { Player, IVideo, IChar } from 'textalive-app-api'

export class PlayerManager {
    private _player: Player;
    private _video: IVideo;

    constructor() {
        const media: HTMLElement | null = document.querySelector("#media");
        if (media === null) {
            throw new Error("media element not found");
        }

        const controlPlay: HTMLElement = document.querySelector("#bt_play")!;
        const controlPause: HTMLElement = document.querySelector("#bt_pause")!;
        const controlStop: HTMLElement = document.querySelector("#bt_rewind")!;

        controlPlay.addEventListener("click", (e) => {
            e.preventDefault();
            if (player) {
                player.requestPlay();
                controlPause.style.display = "inline";
                controlPlay.style.display = "none";
            }
            return false;
        });

        controlPause.addEventListener("click", (e) => {
            e.preventDefault();
            if (player) {
                player.requestPause();
                controlPause.style.display = "none";
                controlPlay.style.display = "inline";
            }
            return false;
        });

        /* 停止ボタン */
        controlStop.addEventListener("click", (e) => {
            e.preventDefault();
            if (player) {
                player.requestStop();
            }
            return false;
        });

        var player = this._player = new Player({
            app: { token: "U0WiRzyOIaolhCks" },
            mediaElement: media,
            mediaBannerPosition: "bottom right"
        });
        let c: any;

        player.addListener({
            onAppReady(app) {
                if (app.managed) {
                    document.querySelector("#control")!.className = "disabled";
                }
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
                let w = player.video.firstWord;
                while (w) {
                    w.animate = function(now, unit) {
                    }
                    w = w.next;
                }
                c = null;
            },

            onTimerReady() {
                console.log("onTimerReady");
                document.querySelector("#controls")!.style.display = "block";
                document.querySelector("#loading")!.style.display = "none";
            },

            onTimeUpdate(time) {

                if (!player.video.firstChar) {
                    return;
                }
                let current = c || player.video.firstChar;
                while (current && current.startTime < time + 500) {
                    // 新しい文字が発声されようとしている
                    // console.log(c, current);
                    if (c !== current) {
                        // console.log("newChar", current);
                        newChar(current);
                        c = current;
                    }
                    current = current.next;
                }

            },

            onPlay() {
                console.log("onPlay");
            },

            onPause() {
                console.log("onPause");
            }
        });

        const view = document.querySelector("#view")!;
        function newChar(c : IChar) {
            console.log("newChar", c);
            view.innerHTML += c.text;
            
        }
    }
}
