const mainAudioPlayer = document.getElementById("main-audio-player").children[0];

const playThis = (source) => {
    localStorage.setItem("currentlyPlaying", source.parentElement.id);
    mainAudioPlayer.src = source.getAttribute("data-audio-src");
    mainAudioPlayer.currentTime = localStorage.getItem(source.parentElement.id) || 0;
    mainAudioPlayer.oncanplay = () => {
        mainAudioPlayer.play();
    };
}

const updateProgress = setInterval(() => {
    if (!localStorage.getItem("currentlyPlaying")) {
        return;
    };

    const episodeID = localStorage.getItem("currentlyPlaying");
    const progressBar = document.getElementById(episodeID).querySelector(".progress-bar");
    progressBar.style.backgroundSize = `${(mainAudioPlayer.currentTime / mainAudioPlayer.duration) * 100 + 3}%`;
    localStorage.setItem(episodeID, mainAudioPlayer.currentTime);

    if (mainAudioPlayer.currentTime >= mainAudioPlayer.duration - 5) {
        localStorage.removeItem("currentlyPlaying");

        const nextEpisode = document.getElementById(episodeID).nextElementSibling;

        if (nextEpisode) {
            playThis(nextEpisode.querySelector(".play-button"));
        } else {
            mainAudioPlayer.pause();
            mainAudioPlayer.currentTime = 0;
            mainAudioPlayer.src = "";
        }
    }
}, 1000);

document.onload = () => {
    if (localStorage.getItem("currentlyPlaying")){
        playThis(document.getElementById(localStorage.getItem("currentlyPlaying")).querySelector(".play-button"));
    }
}