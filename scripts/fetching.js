
const fetchAndSaveAllPrograms = () => {
    const localPrograms = JSON.parse(localStorage.getItem("programs")) || { fetchedAt: 0 };

    // If programs are already saved and no older than 24 hours, return
    if (localPrograms.fetchedAt > new Date().getTime() - 86400000) { // 24 hours = 1000 * 60 * 60 * 24 ms
        console.log("Using cached programs. Cached at:", new Date(localPrograms.fetchedAt));
        return Promise.resolve();
    }

    return fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
        .then(response => response.json())
        .then(data => {
            const programs = data.programs;
            const leanPrograms = programs.map(program => {
                return {
                    id: program.id,
                    name: program.name,
                    description: program.description,
                    image: program.programimage
                }
            })

            const programsAndDate = {
                programs: leanPrograms,
                fetchedAt: new Date().getTime()
            }

            localStorage.setItem("programs", JSON.stringify(programsAndDate));
            console.log("Programs fetched and saved to localStorage");
        })
        .catch(error => {
            console.warn("Error fetching programs:", error);
        });
}

const getEpisodesOfProgram = (programID, force = false) => {
    if (!localStorage.getItem("programs")) {
        console.warn("No programs found in localStorage. Please fetch programs first.");
        return Promise.resolve();
    }

    // Getting dates for the api call
    const oneDayInFuture = new Date()
    oneDayInFuture.setDate(oneDayInFuture.getDate() + 1);
    const oneMonthBack = new Date();
    oneMonthBack.setMonth(oneMonthBack.getMonth() - 1);

    const toDate = oneDayInFuture.toISOString().slice(0, 10);
    const fromDate = (
        toDate.slice(0, 5)
        + ((oneMonthBack.getMonth() + 1)).toString().padStart(2, "0")
        + toDate.slice(7, 10)
    );

    console.log("Fetching episodes...");
    return fetch(`https://api.sr.se/api/v2/episodes/index?programid=${programID}&fromdate=${fromDate}&todate=${toDate}&audioquality=hi&format=json&pagination=false`)
        .then(response => response.json())
        .then(data => {
            const episodes = data.episodes;
            const leanEpisodes = episodes.map(episode => {
                return {
                    title: episode.title || "Avsnittstitel saknas",
                    description: episode.description || "Beskrivning saknas",
                    programName: episode.program.name || "Programnamn saknas",
                    audioURL: episode.downloadpodfile.url,
                    duration: episode.downloadpodfile.duration,
                    publishDate: parseInt(episode.downloadpodfile.publishdateutc.replace(/[^0-9]/g, '')),
                    image: episode.imageurltemplate || episode.imageurl,
                    id: episode.id
                }
            })

            localStorage.setItem("episodes", JSON.stringify(leanEpisodes));
            return leanEpisodes;
        })
        .catch(error => {
            console.warn("Error fetching episodes:", error);
            return Promise.reject(error);
        });
}

const getAllLikedPrograms = () => {
    if (!localStorage.getItem("liked")) {
        console.log("No liked programs found in localStorage.");
        return;
    }
    if (!localStorage.getItem("programs")) {
        console.warn("No programs found in localStorage. Please fetch programs first.");
        return;
    }

    const likedProgramIDs = JSON.parse(localStorage.getItem("liked")) || [];
    const episodes = [];

    likedProgramIDs.forEach(programID => {
        episodes.push(getEpisodesOfProgram(programID));
    });

    return Promise.all(episodes)
        .then(allEpisodes => {
            localStorage.setItem("episodes", JSON.stringify(allEpisodes.flat()))
        })
        .catch(error => {
            console.warn("Error fetching episodes:", error);
        });
}

const populateULwithAudio = () => {
    if (!localStorage.getItem("episodes")) {
        console.warn("No episodes found in localStorage. Please like episodes first.");
        return;
    } else {
        document.getElementById("no-fav-notification").style.display = "none";
    }

    const episodes = JSON.parse(localStorage.getItem("episodes"));

    const ul = document.getElementById("new-episodes");

    episodes.forEach((episode) => {

        const getDisplayDate = (date) => {
            if (new Date(date).toDateString() === new Date().toDateString()) {
                return 'Idag'
            } else if (new Date(date).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
                return 'Igår'
            } else {
                return new Date().toLocaleString('sv-SE', { day: '2-digit', month: 'short' }).replace('.', "");
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

        const setProgress = (episode) => {
            const duration = (episode.duration);
            const progress = localStorage.getItem(`progress${episode.id}`) || 0;

            return `background-size: ${(progress / duration) * 100}%`;
        }

        const li =
            `<li id='episode${episode.id}' data-audio-src='${episode.audioURL}' data-date='${episode.publishDate}' data-duration='${episode.duration}'>
                <div class="img-wrapper">
                    <img class='episode-image' src='${episode.image || '../assets/icons/missing-image48.png'}' alt='Bild'>

                    <div class='progress-bar' data-progress='' style='${setProgress(episode)}'></div>
                </div>

                <p class='program-name'>${episode.programName}</p>

                <p class='title'>${episode.title}</p>

                <p class='description'>${episode.description}</p>

                <p class='meta-data' >
                ${setMetaData(episode)}
                </p>

                <div class='play-button' onclick='playThis(this)'>
                    <p>▶</p>
                </div>
            </li>`

        ul.innerHTML += li;
    });
}

const playThis = (src) => {
    const li = src.parentElement;
    console.log(li);
    mainAudioTag.src = li.dataset.audioSrc;
    mainAudioTag.setAttribute("data-playing-id", li.id);
    mainAudioTag.oncanplay = () => { mainAudioTag.play() }
}

window.onload = () => {
    // vv DEBUG vv
    localStorage.setItem("liked", '["4923"]') // ,"178","3626","5524","2778"

    fetchAndSaveAllPrograms().then(() => {
        console.log(JSON.parse(localStorage.getItem("programs")));

        getAllLikedPrograms().then(() => {
            const episodes = JSON.parse(localStorage.getItem("episodes"));

            episodes.sort((a, b) => b.publishDate - a.publishDate);

            localStorage.setItem("episodes", JSON.stringify(episodes));

            populateULwithAudio();
        });
    })
}