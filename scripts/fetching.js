
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
                    duration: episode.downloadpodfile.duration || "-",
                    publishDate: parseInt(episode.downloadpodfile.publishdateutc.replace(/[^0-9]/g, '')),
                    image: episode.imageurltemplate || episode.imageurl
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
        const li = document.createElement("li");

        const img = document.createElement("img");
        img.src = "../assets/icons/missing-image48.png";
        img.alt = "Bild";
        li.appendChild(img);

        const programName = document.createElement("p");
        programName.classList.add("show-name");
        programName.innerText = episode.programName;
        li.appendChild(programName);

        const title = document.createElement("p");
        title.classList.add("title");
        title.innerText = episode.title;
        li.appendChild(title);

        const description = document.createElement("p");
        description.classList.add("description");
        description.innerText = episode.description;
        li.appendChild(description);

        const customAudio = document.createElement("div");
        customAudio.classList.add("custom-audio");
        const audio = document.createElement("audio");
        customAudio.appendChild(audio);
        li.appendChild(customAudio);

        const seconds = (episode.duration % 60).toString().padStart(2, "0");
        const minutes = Math.floor(episode.duration / 60);
        const meta = document.createElement("p");
        meta.classList.add("meta");
        meta.innerText = minutes + ":" + seconds;
        li.appendChild(meta);

        ul.appendChild(li)
    })
}

window.onload = () => {
    // DEBUG
    localStorage.setItem("liked", '["4923","178","3626","5524","2778"]')

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