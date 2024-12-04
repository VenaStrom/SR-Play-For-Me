
class AudioPlayer {
    constructor() {
        this.DOM = document.querySelector("#player");
        this.playButton = this.DOM.querySelector("button");
        this.timeDisplay = this.DOM.querySelector(".time-display");
        this.progressBarContainer = this.DOM.querySelector(".progress-bar");

        // Whether the current audio track is playing or not
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

    setProgress(fraction) {
        const lowestBound = 0.03; // To prevent the progress bar from being too small
        const highestBound = 1;

        const cleanedFraction = parseFloat(fraction.toString().replace(/[^0-9.]/g, "")).toFixed(2);
        const displayPercent = (cleanedFraction * (highestBound - lowestBound) + lowestBound) * 100;

        const progressBar = this.progressBarContainer.querySelector(".foreground");
        progressBar.style.width = displayPercent + "%";
    }
}