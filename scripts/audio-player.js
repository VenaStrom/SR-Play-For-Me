
class AudioPlayer {
    constructor() {
        this.DOM = document.querySelector("#player");
        this.playButton = this.DOM.querySelector("button");
        this.timeDisplay = this.DOM.querySelector("#time");

        this.playing = false;

        this.playButtonInit();
    }

    playButtonInit() {
        this.playButton.addEventListener("click", () => {
            if (this.playing === false) {
                this.playing = true;
                this.playButton.querySelector("img").src = "assets/icons/icons8-pause-48.png";
            } else {
                this.playing = false;
                this.playButton.querySelector("img").src = "assets/icons/icons8-play-48.png";
            }
        });
    }
}