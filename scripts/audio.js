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
        navigator.mediaSession.setActionHandler("seekbackward", () => {
            mainAudioPlayer.currentTime -= 15;
        });
        navigator.mediaSession.setActionHandler("seekforward", () => {
            mainAudioPlayer.currentTime += 15;
        });
        navigator.mediaSession.setActionHandler("seekto", (details) => {
            mainAudioPlayer.currentTime = details.seekTime;

            if ("mediaSession" in navigator) {
                navigator.mediaSession.playbackState = "paused";

                navigator.mediaSession.setPositionState({
                    duration: parseInt(episode.duration),
                    position: parseInt(mainAudioPlayer.currentTime),
                });

                mainAudioPlayer.oncanplay = () => {
                    mainAudioPlayer.play();
                };
            };
        });
        navigator.mediaSession.setActionHandler('play', () => {
            mainAudioPlayer.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            mainAudioPlayer.pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            let episodeIndex;
            JSON.parse(localStorage.getItem("episodes")).filter((episode, index) => {
                if (episode.id === episodeID) {
                    episodeIndex = index;
                    return episode;
                }
            })[0];
            const nextEpisode = JSON.parse(localStorage.getItem("episodes"))[episodeIndex + 1];

            if (nextEpisode) {
                playThis(nextEpisode.id);
            }
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            let episodeIndex;
            JSON.parse(localStorage.getItem("episodes")).filter((episode, index) => {
                if (episode.id === episodeID) {
                    episodeIndex = index;
                    return episode;
                }
            })[0];
            const previousEpisode = JSON.parse(localStorage.getItem("episodes"))[episodeIndex - 1];

            if (previousEpisode) {
                playThis(previousEpisode.id);
            }
        });
    }
}

if (localStorage.getItem("currentlyPlaying")) {
    playThis(localStorage.getItem("currentlyPlaying"));
    mainAudioPlayer.oncanplay = () => {
        mainAudioPlayer.play();
    };
}

const updateProgress = setInterval(() => {
    const currentlyPlaying = localStorage.getItem("currentlyPlaying");

    if (currentlyPlaying) {
        localStorage.setItem(currentlyPlaying, mainAudioPlayer.currentTime);

        const episodes = JSON.parse(localStorage.getItem("episodes"));
        const episode = episodes.filter(episode => episode.id === currentlyPlaying)[0];

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "paused";

            navigator.mediaSession.setPositionState({
                duration: parseInt(episode.duration),
                position: parseInt(mainAudioPlayer.currentTime),
            });
        };

        if (document.getElementById("new-episodes")) {
            const episodeDOM = document.getElementById(currentlyPlaying);
            const progressBar = episodeDOM.querySelector(".progress-bar");
            const duration = progressBar.getAttribute("data-duration");
            const progress = (mainAudioPlayer.currentTime / duration) * 100 + 3;
            progressBar.style.backgroundSize = `${progress}%`;
        }

        if (mainAudioPlayer.currentTime >= episode.duration - 1) {
            localStorage.removeItem("currentlyPlaying");
            mainAudioPlayer.pause();
            mainAudioPlayer.src = "";

            // Try next episode
            const nextEpisode = episodes[episodes.indexOf(episode) + 1];
            if (nextEpisode) {
                playThis(nextEpisode.id);
            }
        }
    }
}, 1000);
