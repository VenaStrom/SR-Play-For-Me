
const mainAudioPlayer = document.querySelector("#main-audio-player audio");

const playNewest = () => {
    // Get the latest episodes
    fetchEpisodes(localStorage.getItem("liked"));

    const episodes = JSON.parse(localStorage.getItem("episodes"));
    const latestEpisode = episodes[0];

    playThis(latestEpisode.id);
};

const playNext = () => {
    const currentlyPlaying = localStorage.getItem("currentlyPlaying");
    const episodes = JSON.parse(localStorage.getItem("episodes"));
    const episodeIndex = episodes.map((episode, index) => { episode.index = index; return episode; }).filter(episode => episode.id === currentlyPlaying)[0].index;
    const nextEpisode = episodes[episodeIndex + 1];

    console.log("Playing next episode", nextEpisode);

    if (nextEpisode) {
        playThis(nextEpisode.id);
    };
};

const playPrevious = () => {
    const currentlyPlaying = localStorage.getItem("currentlyPlaying");
    const episodes = JSON.parse(localStorage.getItem("episodes"));
    const episodeIndex = episodes.map((episode, index) => { episode.index = index; return episode; }).filter(episode => episode.id === currentlyPlaying)[0].index;
    const previousEpisode = episodes[episodeIndex - 1];

    console.log("Playing previous episode", previousEpisode);

    if (previousEpisode) {
        playThis(previousEpisode.id);
    };
};

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
        navigator.mediaSession.setActionHandler("seekbackward", (details) => {
            mainAudioPlayer.currentTime -= details.seekOffset || 15; // 15 seconds is the default if the seekOffset is not provided
        });
        navigator.mediaSession.setActionHandler("seekforward", (details) => {
            mainAudioPlayer.currentTime += details.seekOffset || 15; // 15 seconds is the default if the seekOffset is not provided
        });
        navigator.mediaSession.setActionHandler("seekto", (details) => {
            mainAudioPlayer.currentTime = details.seekTime;

            navigator.mediaSession.setPositionState({
                duration: parseInt(episode.duration),
                position: parseInt(mainAudioPlayer.currentTime),
            });

            mainAudioPlayer.oncanplay = () => {
                mainAudioPlayer.play();
            };
        });
        navigator.mediaSession.setActionHandler("play", () => {
            mainAudioPlayer.play();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
            mainAudioPlayer.pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            playNext();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            // For my use case i'd rather have the previous button go to the latest episode so i can avoid opening the app
            playNewest();

            // // This is the default behavior which is sensible and standard but not what I want
            // playPrevious();
        });
    }
};

const startUpdates = () => {
    // Runs every second to update the progress of the episode
    const updateProgress = setInterval(() => {

        const currentlyPlaying = localStorage.getItem("currentlyPlaying");

        if (!currentlyPlaying) { return };

        localStorage.setItem(currentlyPlaying, mainAudioPlayer.currentTime);

        // Lists of all of the episodes of the programs you've liked
        const episodes = JSON.parse(localStorage.getItem("episodes"));
        // Gets the episode object of the currently playing episode 
        const episode = episodes.filter(episode => episode.id === currentlyPlaying)[0];

        if ("mediaSession" in navigator) {
            // Update the duration and the progress in the media session API
            navigator.mediaSession.setPositionState({
                duration: parseInt(episode.duration),
                position: parseInt(mainAudioPlayer.currentTime),
            });

            // Update the playback state in the media session API
            // This might be redundant since the playback state is set later in this file via event listeners
            if (mainAudioPlayer.playing) {
                navigator.mediaSession.playbackState = "playing";
            } else {
                navigator.mediaSession.playbackState = "paused";
            };
        };

        // Sets the progress bar of the episode DOM, if you are looking at the "new episodes" page (liked.html)
        if (document.getElementById("new-episodes")) {
            const episodeDOM = document.getElementById(currentlyPlaying);

            const progressBar = episodeDOM.querySelector(".progress-bar");
            const duration = progressBar.getAttribute("data-duration");
            const progress = (mainAudioPlayer.currentTime / duration) * 100 + 3; // Min value of 3 for esthetic reasons

            progressBar.style.backgroundSize = `${progress}%`;
        };

        // Cache the current episode in case of quick switching in between episodes
        if (!document.querySelector(`link[href="${episode.audioURL}"]`)) {

            // Create a link tag that will prefetch the audio file
            const linkTag = document.createElement("link");
            linkTag.rel = "prefetch";
            linkTag.as = "audio";
            linkTag.href = episode.audioURL;
            linkTag.id = "cached" + episode.id;
            document.head.appendChild(linkTag);

            console.log("Cached episode: ", episode);

            const clearCache = (thisTag, thisEpisode) => {
                // If and hour has passed, remove it from the cache unless it's still playing
                setTimeout(() => {
                    // If the episode is still playing, keep it in the cache
                    if (localStorage.getItem("currentlyPlaying") === thisEpisode.id) { clearCache(thisTag, thisEpisode) }

                    // Else, remove the cached episode
                    console.log("Removing cached episode: ", thisEpisode);

                    thisTag.remove();
                },
                    600000 // 10 minute timeout
                );
            };

            clearCache(linkTag, episode);
        };

        // Cache the next episode so that the transition to the next episode is smoother
        const nextEpisode = episodes[episodes.indexOf(episode) + 1];
        // If there is a next episode and there isn't already a tag for it, cache it
        if (nextEpisode && !document.querySelector(`link[href="${nextEpisode.audioURL}"]`)) {

            // Create a link tag that will prefetch the audio file
            const linkTag = document.createElement("link");
            linkTag.rel = "prefetch";
            linkTag.as = "audio";
            linkTag.href = nextEpisode.audioURL;
            linkTag.id = "cached" + nextEpisode.id;
            document.head.appendChild(linkTag);

            console.log("Cached next episode: ", nextEpisode);

            const clearCache = (thisTag, thisEpisode) => {
                // If and hour has passed, remove it from the cache unless it's still playing
                setTimeout(() => {
                    // if the episode is still playing, keep it
                    if (localStorage.getItem("currentlyPlaying") === thisEpisode.id) { clearCache(thisTag, thisEpisode) }

                    // Else, remove the cached episode
                    console.log("Removing cached episode: ", thisEpisode);

                    thisTag.remove();
                },
                    600000 // 10 minute timeout
                );
            };

            clearCache(linkTag, nextEpisode);
        };

        // If the episode is over, try to play the next episode
        if (mainAudioPlayer.currentTime >= episode.duration - 1) {
            // Try next episode
            try {
                playNext();
                return;

            } catch (error) {
                // This is mostly a debugging measure
                console.warn(error);
                alert("You've reached the end of the episode list. If you haven't actually, this is an error.");
            };
        };
    }, 1000);
};

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

const audioOnload = () => {
    const currentlyPlaying = localStorage.getItem("currentlyPlaying");

    if (!currentlyPlaying) {
        startUpdates();
        return;
    };

    const currentProgress = localStorage.getItem(currentlyPlaying);
    const episodeObj = JSON.parse(localStorage.getItem("episodes")).filter(episode => episode.id === currentlyPlaying)[0];

    mainAudioPlayer.src = episodeObj.audioURL;
    mainAudioPlayer.currentTime = currentProgress;

    mainAudioPlayer.oncanplay = () => {
        startUpdates();
    };
};

audioOnload();
