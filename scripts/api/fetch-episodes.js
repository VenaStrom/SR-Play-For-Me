
const formatEpisodeData = (episodeData) => {
    return {
        id: episodeData.id,
        name: episodeData.title,
        description: episodeData.description,
        image: episodeData.imageurl,
        url: episodeData?.downloadpodfile?.url || episodeData?.listenpodfile?.url || null,
        program: episodeData?.program?.name || "",
        publishDate: new Date(parseInt(episodeData.publishdateutc.replace(/[^0-9]/g, "")) + new Date().getTimezoneOffset() * 60000),
    };
};

const getGetAllEpisodes = async (programID) => {
    if (!programID) return null;

    const response = await fetch(api.allEpisodes.getURI(programID));

    if (!response.ok) {
        console.warn("Didn't get a proper response from the Sveriges Radio API when fetching the episodes. ProgramID, URL and response:", programID, api.allEpisodes.getURI(programID), response);
        return null;
    }

    const rawEpisodes = (await response.json()).episodes;

    if (!rawEpisodes) {
        console.warn("Didn't get any episodes from the Sveriges Radio API when fetching the episodes. ProgramID, URL and response:", programID, api.allEpisodes.getURI(programID), response);
        return null;
    }

    const episodes = rawEpisodes.map(formatEpisodeData);

    return episodes;
};

const getLatestEpisode = async (programID) => {
    if (!programID) return null;

    const response = await fetch(api.latestEpisode.getURI(programID));

    if (!response.ok) {
        console.warn("Didn't get a proper response from the Sveriges Radio API when fetching the latest episode. ProgramID, URL and response:", programID, api.latestEpisode.getURI(programID), response);
        return null;
    }

    const rawEpisode = (await response.json()).episode;

    if (!rawEpisode) {
        console.warn("Didn't get any episode from the Sveriges Radio API when fetching the latest episode. ProgramID, URL and response:", programID, api.latestEpisode.getURI(programID), response);
        return null;
    }

    const episode = formatEpisodeData(rawEpisode);

    return episode;
};

const getEpisode = async (episodeID) => {
    if (!episodeID) return null;

    const response = await fetch(api.episode.getURI(episodeID));

    if (!response.ok) {
        console.warn("Didn't get a proper response from the Sveriges Radio API when fetching the episode. EpisodeID, URL and response:", episodeID, api.episode.getURI(episodeID), response);
        return null;
    }

    const rawEpisode = (await response.json()).episode;

    if (!rawEpisode) {
        console.warn("Didn't get any episode from the Sveriges Radio API when fetching the episode. EpisodeID, URL and response:", episodeID, api.episode.getURI(episodeID), response);
        return null;
    }

    const episode = formatEpisodeData(rawEpisode);

    return episode;
};

const setLatestEpisodeOnVisiblePrograms = async () => {
    const visiblePrograms = document.querySelectorAll("section.programs>ul>li");

    const promises = [];

    for (const program of visiblePrograms) {
        const programId = program.id.split("-").at(-1);

        promises.push(getLatestEpisode(programId));
    }

    const episodes = await Promise.all(promises);

    episodes.forEach((episode, index) => {
        if (episode) {
            visiblePrograms[index].querySelector(".footer>p").innerHTML = `Senaste:&nbsp ${episode.name}`;
        }
    });
};