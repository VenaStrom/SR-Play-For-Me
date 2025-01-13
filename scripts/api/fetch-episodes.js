"use strict";

const { config } = require("./config");


class EpisodeFetch {
    constructor() { }

    noResponseMessage(ID, URL, response) {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the episode(s).
            ID: ${ID}
            UL used: ${URL}
            Response: ${response}
            `.trim());
    }

    formatAndFilterEpisodeData(episodeData) {
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

    async all(programID) {
        if (!programID) return console.error("No programID provided.");

        const response = await fetch(config.allEpisodes.getURI(programID));
        if (!response.ok) return this.noResponseMessage(programID, config.allEpisodes.getURI(programID), response);

        const episodes = (await response.json()).episodes;

        return episodes.map(this.formatAndFilterEpisodeData);
    }

    async latest(programID) {
        if (!programID) return console.error("No programID provided.");

        const response = await fetch(config.latestEpisode.getURI(programID));
        if (!response.ok) return this.noResponseMessage(programID, config.latestEpisode.getURI(programID), response);

        const episode = (await response.json()).episode;

        return this.formatAndFilterEpisodeData(episode);
    }

    async single(episodeID) {
        if (!episodeID) return console.error("No episodeID provided.");

        const response = await fetch(config.episode.getURI(episodeID));
        if (!response.ok) return this.noResponseMessage(episodeID, config.episode.getURI(episodeID), response);

        const episode = (await response.json()).episode;

        return this.formatAndFilterEpisodeData(episode);
    }
}


module.exports = { EpisodeFetch };