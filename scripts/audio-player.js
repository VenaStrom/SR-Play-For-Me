
class AudioPlayer {
    constructor() {
        this.DOM = document.querySelector("#player");
        this.playButton = this.DOM.querySelector("button");
        this.timeDisplay = this.DOM.querySelector(".time-display");
        this.progressBarContainer = this.DOM.querySelector(".progress-bar");

        // Whether the current audio track is playing or not
        this.playing = false;

        this.currentTrack = null;
        this.nextTrack = null; // For caching

        this.handlePlayButtonClicking();
    }

    play() {
        if (!this.currentTrack) {
            console.warn("No track loaded. Trying to play.");
            return;
        }

        this.currentTrack.play();
        this.playing = true;
        this.setPlayButtonState();
    }

    pause() {
        if (!this.currentTrack) {
            console.warn("No track loaded. Trying to pause.");
            return;
        }

        this.currentTrack.pause();
        this.playing = false;
        this.setPlayButtonState();
    }

    loadTrack(url) {
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack = null;
        }
        this.currentTrack = new Audio(url);
    }

    startTrack(url) {
        this.loadTrack(url);
        this.play();
    }

    setProgressBar(fraction) {
        const lowestBound = 0.03; // To prevent the progress bar from being too small
        const highestBound = 1;

        const cleanedFraction = parseFloat(fraction.toString().replace(/[^0-9.]/g, "")).toFixed(2);
        const displayPercent = (cleanedFraction * (highestBound - lowestBound) + lowestBound) * 100;

        const progressBar = this.progressBarContainer.querySelector(".foreground");
        progressBar.style.width = displayPercent + "%";
    }

    updateProgressBar() {
        if (!this.currentTrack) {
            return;
        }

        const duration = this.currentTrack.duration;
        const currentTime = this.currentTrack.currentTime;

        if (duration) {
            this.setProgressBar(currentTime / duration);
        }
    }

    setPlayButtonState() {
        const playIcon = "assets/icons/icons8-play-48.png";
        const pauseIcon = "assets/icons/icons8-pause-48.png";

        if (!this.playing) {
            this.playButton.querySelector("img").src = playIcon;
        } else {
            this.playButton.querySelector("img").src = pauseIcon;
        }
    }

    handlePlayButtonClicking() {
        // Main play button in the player controls
        this.playButton.addEventListener("click", () => {

            if (this.playing) {
                this.pause();
            } else {
                this.play();
            }

            this.setPlayButtonState();
        });

        // Start button clicking, i.e. small play buttons linked to content
        document.body.addEventListener("click", (event) => {
            if (
                event.target.tagName === "BUTTON"
                &&
                event.target.dataset.id
            ) {
                const [type, id] = event.target.dataset.id.split("-");

                if (type === "channel") {
                    const channel = contentStorageManager.get("channels").find((channel) => channel.id === parseInt(id));

                    if (channel) {
                        this.startTrack(channel.url);
                    }
                }

                document.body.dispatchEvent(new Event("startbuttonclicked"));
            }
        });
    }
}