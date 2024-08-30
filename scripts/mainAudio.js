const mainAudioTag = document.querySelector("#main-audio-player audio")


const updateProgressBars = setInterval(() => {
    const playingID = mainAudioTag.getAttribute("data-playing-id");

    if (playingID) {
        const progress = mainAudioTag.currentTime;
        const duration = mainAudioTag.duration;

        const progressBar = document.querySelector(`#${playingID} .progress-bar`);
        progressBar.style = `background-size: ${(progress / duration) * 100}%`;

        localStorage.setItem(`progress${playingID}`, progress);
    }
}, 1000)