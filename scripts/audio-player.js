const api = require("./api/api");

class AudioPlayer {
    track = new Audio();
    preload = new Audio();

    controlDOM = document.querySelector("#player");

    playIconPath = "assets/icons/icons8-play-48.png";
    pauseIconPath = "assets/icons/icons8-pause-48.png";

    progressOverride = false;

    constructor() {
        this.track.preload = "auto";
        this.preload.preload = "auto";


        // ControlDOM play button
        const playButton = this.controlDOM.querySelector("button");
        playButton.addEventListener("click", () => {
            if (this.track.paused) {
                this.unpause();
            } else {
                this.pause();
            }
        });


        // Play by URL
        window.startTrackURL = () => document.dispatchEvent(new Event("startTrackURL"));
        document.addEventListener("startTrackURL", async (event) => {
            const playButton = event?.target?.activeElement;
            if (!playButton) return console.error("No play button found.");

            const url = playButton.dataset.playUrl;

            if (playButton.dataset.progressOverride) {
                this.progressOverride = true;
            }
            else {
                this.progressOverride = false;
            }

            this.startTrack(url);
        });


        // Progress update 
        this.track.addEventListener("timeupdate", () => {
            this.updateDOM();
        });
    }

    pause() {
        this.track.pause();
        this.controlDOM.querySelector("button img").src = this.playIconPath;
    }

    unpause() {
        if (this.track.src === "") return;

        this.track.play();
        this.controlDOM.querySelector("button img").src = this.pauseIconPath;
    }

    loadTrack(url) {
        this.track.src = url;
    }

    startTrack(url) {
        this.track.addEventListener("canplaythrough", () => {
            this.unpause();
        }, { once: true });

        this.loadTrack(url);
    }

    preloadTrack(url) {
        this.preload.src = url;
    }

    setProgressBarDOM(fraction) {
        const progressBar = this.controlDOM.querySelector(".progress-bar .foreground");

        const margin = 2;
        const width = margin + parseInt(fraction) * (100 - margin);

        progressBar.style.width = `${width}%`;
    }

    setProgressTimeDOM(time) {
        const timeDisplay = this.controlDOM.querySelector(".time-display");
        timeDisplay.textContent = time;
    }

    updateDOM() {
        const elapsedSeconds = this.track.currentTime;
        const duration = this.track.duration;

        if (this.progressOverride) {
            this.setProgressTimeDOM("• Live");
            this.setProgressBarDOM(1);
            return;
        }

        const minutes = `${Math.floor(elapsedSeconds / 60)}`.padStart(2, "0");
        const seconds = `${Math.floor(elapsedSeconds % 60)}`.padStart(2, "0");

        this.setProgressTimeDOM(`${minutes}:${seconds}`);
        this.setProgressBarDOM(elapsedSeconds / duration);
    }
}

module.exports = new AudioPlayer;