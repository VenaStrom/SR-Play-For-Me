
const mainAudioPlayer = document.querySelector("#main-audio-player audio");

// Play the episode specified via its ID
const playThis = (episodeID) => {
    const episode = JSON.parse(localStorage.getItem("episodes")).filter(episode => episode.id === episodeID)[0];

    // Update which episode is playing
    localStorage.setItem("currentlyPlaying", episodeID);
    mainAudioPlayer.src = episode.audioURL;
    mainAudioPlayer.currentTime = localStorage.getItem(episodeID);
    mainAudioPlayer.oncanplay = () => { mainAudioPlayer.play() };

    // This handles when you interact with the media controls on your device
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
};

// Runs every second to update the progress of the episode
const updateProgress = setInterval(() => {
    // LocalStorage:
    //  currentlyPlaying: The ID of the episode that is currently playing
    //  [episodeID]: The time where the episode is currently at

    const currentlyPlaying = localStorage.getItem("currentlyPlaying");

    if (!currentlyPlaying) { return };

    localStorage.setItem(currentlyPlaying, mainAudioPlayer.currentTime);

    // Lists of all of the episodes of the programs you've liked
    const episodes = JSON.parse(localStorage.getItem("episodes"));
    // A kinda janky way to get the episode that is currently playing
    const episode = episodes.filter(episode => episode.id === currentlyPlaying)[0];

    if ("mediaSession" in navigator) {
        navigator.mediaSession.setPositionState({
            duration: parseInt(episode.duration),
            position: parseInt(mainAudioPlayer.currentTime),
        });
    };

    // Sets the progress bar of the episode DOM if you're in liked.html
    if (document.getElementById("new-episodes")) {
        const episodeDOM = document.getElementById(currentlyPlaying);
        const progressBar = episodeDOM.querySelector(".progress-bar");
        const duration = progressBar.getAttribute("data-duration");
        const progress = (mainAudioPlayer.currentTime / duration) * 100 + 3;
        progressBar.style.backgroundSize = `${progress}%`;
    }

    // Cache the current episode in case of quick switching in between episodes
    if (!document.querySelector(`link[href="${episode.audioURL}"]`)) {
        const linkTag = document.createElement("link");
        linkTag.rel = "prefetch";
        linkTag.href = episode.audioURL;
        document.head.appendChild(linkTag);
    };

    // Cache the next episode so that the transition to the next episode is smoother
    const nextEpisode = episodes[episodes.indexOf(episode) + 1];
    if (
        nextEpisode
        &&
        !document.querySelector(`link[href="${nextEpisode.audioURL}"]`)
    ) {
        const linkTag = document.createElement("link");
        linkTag.rel = "prefetch";
        linkTag.href = nextEpisode.audioURL;
        document.head.appendChild(linkTag);
    };

    // If the episode is over, try to play the next episode
    if (mainAudioPlayer.currentTime >= episode.duration - 1) {
        localStorage.removeItem("currentlyPlaying");
        mainAudioPlayer.pause();
        mainAudioPlayer.src = "";

        // Try next episode
        const nextEpisode = episodes[episodes.indexOf(episode) + 1];
        if (nextEpisode) {
            playThis(nextEpisode.id);
        } else {
            // This is mostly a debugging measure
            alert("You've reached the end of the episode list. If you haven't actually, this is an error.");
        };
    }
}, 1000);

// Set playback state when main audio player is changed
mainAudioPlayer.addEventListener("play", () => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
    }
});
mainAudioPlayer.addEventListener("pause", () => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
    }
});

// Start the playing episode on page load
if (localStorage.getItem("currentlyPlaying")) {
    playThis(localStorage.getItem("currentlyPlaying"));

    mainAudioPlayer.play();
    mainAudioPlayer.oncanplay = () => {
        mainAudioPlayer.play();
    };
};