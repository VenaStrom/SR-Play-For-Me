
const episodesUL = document.getElementById("new-episodes")

const fetchEpisodes = (programIDs) => {
    const episodes = [];

    programIDs.forEach((id) => {

        const fromDate = new Date(new Date().getTime() - 604800000).toISOString().slice(0, 10)
        const toDate = new Date(new Date().getTime() + 86400000).toISOString().slice(0, 10)

        fetch(`https://api.sr.se/api/v2/episodes/index?programid=${id.replace(/[^0-9]/g, '')}&fromdate=${fromDate}&todate=${toDate}&audioquality=hi&format=json&pagination=false`)
            .then(response => response.json())
            .then(data => {

                data.episodes.forEach(episode => {
                    episodes.push({
                        id: "episode" + episode.id,
                        title: episode.title || "Avsnittstitel saknas",
                        description: episode.description || "Beskrivning saknas",
                        programName: episode.program.name || "Programnamn saknas",
                        image: episode.imageurltemplate || episode.imageurl || "../assets/icons/missing-image48.png",
                        duration: episode.downloadpodfile.duration || episode.listenpodfile.duration,
                        audioURL: episode.downloadpodfile.url || episode.listenpodfile.url,
                        publishDate: parseInt(episode.downloadpodfile.publishdateutc.replace(/[^0-9]/g, '')),
                    })
                })
            }).then(() => {
                localStorage.setItem("episodes", JSON.stringify(episodes));
                makeEpisodeDOMS(episodes)
            });
    });
}

const reProgressEpisodes = (episodes) => {
    episodes.forEach(episode => {
        const progressBar = document.getElementById(episode.id).querySelector(".progress-bar");

        const duration = progressBar.getAttribute("data-duration");
        const progress = localStorage.getItem("episode" + episode.id) || 0;

        if (progress > 0) {
            progressBar.style.backgroundSize = `${progress / duration * 100 + 3}%`;
        }
    });
}

const makeEpisodeDOMS = (episodes) => {
    episodesUL.innerHTML = "";

    const getDisplayDate = (date) => {
        if (new Date(date).toDateString() === new Date().toDateString()) {
            return 'Idag'
        } else if (new Date(date).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
            return 'Igår'
        } else {
            return new Date(date).toLocaleString('sv-SE', { day: '2-digit', month: 'short' }).replace("0", "").replace('.', "");
        }
    }
    const getTime = (date) => {
        return new Date(date).toLocaleString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    }
    const getDuration = (duration) => {
        return Math.round(duration / 60) + " MIN";
    }
    const setMetaData = (episode) => {
        return `${getDisplayDate(episode.publishDate)} &nbsp; | &nbsp; ${getTime(episode.publishDate)} &nbsp; • &nbsp; ${getDuration(episode.duration)}`;
    }

    episodes.forEach(episode => {
        const li = document.createElement("li");
        li.id = episode.id;

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("img-wrapper");
        const img = document.createElement("img");
        img.classList.add("episode-image");
        img.src = episode.image;
        img.alt = "Bild";
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        progressBar.setAttribute("data-duration", episode.duration);
        progressBar.style.backgroundSize = "0%";
        imgDiv.appendChild(img);
        imgDiv.appendChild(progressBar);

        const program = document.createElement("p");
        program.classList.add("program-name");
        program.textContent = episode.programName;

        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = episode.title;

        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = episode.description;

        const metaData = document.createElement("p");
        metaData.classList.add("meta-data");
        metaData.innerHTML = setMetaData(episode);

        const playButton = document.createElement("div");
        playButton.classList.add("play-button");
        playButton.setAttribute("data-audio-src", episode.audioURL);
        playButton.setAttribute("onclick", "playThis(this.parentElement.id)");
        const playIcon = document.createElement("p");
        playIcon.textContent = "▶";
        playButton.appendChild(playIcon);

        li.appendChild(imgDiv);
        li.appendChild(program);
        li.appendChild(title);
        li.appendChild(description);
        li.appendChild(metaData);
        li.appendChild(playButton);

        episodesUL.appendChild(li);
    });

    reProgressEpisodes(episodes)
}

const episodesOnload = () => {
    if (localStorage.getItem("liked")) { document.getElementById("no-fav-notification").style.display = "none" }

    const liked = JSON.parse(localStorage.getItem("liked")) || [];

    const programs = localStorage.getItem("programs");
    if (programs) {
        fetchEpisodes(liked);
    } else {
        fetchPrograms().then(() => {
            fetchEpisodes(liked);
        });
    }
}

episodesOnload();