const mainAudioPlayer = document.getElementById("main-audio-player").children[0];

const playThis = (episodeID) => {
    const episode = JSON.parse(localStorage.getItem("episodes")).filter(episode => episode.id === episodeID)[0];
    localStorage.setItem("currentlyPlaying", episodeID);
    mainAudioPlayer.src = episode.audioURL;
    mainAudioPlayer.currentTime = localStorage.getItem(episodeID);
    mainAudioPlayer.oncanplay = () => {
        mainAudioPlayer.play();
    };

    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: episode.title,
            artist: episode.programName,
            album: "SRplay",
            artwork: [
                { src: episode.image },
            ]
        });

        // You can also handle media actions (like play, pause, next, etc.)
        navigator.mediaSession.setActionHandler('play', () => {
            mainAudioPlayer.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            mainAudioPlayer.pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            const episodes = JSON.parse(localStorage.getItem("episodes"));
            const nextEpisode = episodes[episodes.indexOf(episode) + 1];
            if (nextEpisode) {
                playThis(nextEpisode.id);
            }
        });
    }
}

if (localStorage.getItem("currentlyPlaying")) {
    playThis(localStorage.getItem("currentlyPlaying"));
    mainAudioPlayer.oncanplay = () => {
        mainAudioPlayer.pause();
    };
}

const updateProgress = setInterval(() => {
    const currentlyPlaying = localStorage.getItem("currentlyPlaying");

    if (currentlyPlaying) {
        localStorage.setItem(currentlyPlaying, mainAudioPlayer.currentTime);

        if (document.getElementById("new-episodes")) {
            const episodeDOM = document.getElementById(currentlyPlaying);
            const progressBar = episodeDOM.querySelector(".progress-bar");
            const duration = progressBar.getAttribute("data-duration");
            const progress = (mainAudioPlayer.currentTime / duration) * 100 + 3;
            progressBar.style.backgroundSize = `${progress}%`;
        }

        const episodes = JSON.parse(localStorage.getItem("episodes"));
        const episode = episodes.filter(episode => episode.id === currentlyPlaying)[0];
        if (mainAudioPlayer.currentTime >= episode.duration - 1) {
            localStorage.removeItem("currentlyPlaying");
            mainAudioPlayer.src = "";
            mainAudioPlayer.pause();

            // Try next episode
            const nextEpisode = episodes[episodes.indexOf(episode) + 1];
            if (nextEpisode) {
                playThis(nextEpisode.id);
            }
        }
    }
}, 1000);