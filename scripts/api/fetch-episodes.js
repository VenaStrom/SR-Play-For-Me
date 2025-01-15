"use strict";

const commonConfig = require("./common-config.json");

class EpisodeFetch {
    constructor() { }

    config = {
        byProgram: {
            all: {
                suffix: "episodes/index",
                arguments: [],
                makeURL: (programID) => {
                    if (!programID) return console.error("No programID provided.");

                    const fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() - commonConfig.fetchSpan.pastOffset);
                    const toDate = new Date();
                    toDate.setDate(toDate.getDate() + commonConfig.fetchSpan.futureOffset);

                    const query = [`fromDate=${fromDate}`, `toDate=${toDate}`, ...this.config.byProgram.all.arguments, ...commonConfig.arguments,];
                    const path = `${commonConfig.baseURL}${this.config.byProgram.all.suffix}`;
                    return `${path}?programid=${programID}&${query.join("&")}`;
                },
            },
            latest: {
                suffix: "episodes/getlatest",
                arguments: [],
                makeURL: (programID) => {
                    if (!programID) return console.error("No programID provided.");
                    const query = [...this.config.byProgram.latest.arguments, ...commonConfig.arguments,];
                    const path = `${commonConfig.baseURL}${this.config.byProgram.latest.suffix}`;
                    return `${path}?programid=${programID}&${query.join("&")}`;
                },
            },
        },
        byID: {
            suffix: "episodes/get",
            arguments: [],
            makeURL: (episodeID) => {
                if (!episodeID) return console.error("No episodeID provided.");
                const query = [...this.config.byID.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.byID.suffix}`;
                return `${path}?id=${episodeID}&${query.join("&")}`;
            },
        },
    }

    badResponseMessage(URL, response, ID = "N/A") {
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
    }

    async byID(episodeID) {
        const response = await fetch(this.config.byID.makeURL(episodeID));
        if (!response.ok) return this.badResponseMessage(episodeID, this.config.byID.makeURL(episodeID), response, episodeID);

        const episode = (await response.json()).episode;
        if (!episode) return this.badResponseMessage(episodeID, this.config.byID.makeURL(episodeID), response, episodeID);

        return this.formatAndFilterEpisodeData(episode);
    }

    byProgram = new ByProgram;
}

class ByProgram {
    constructor() { }

    async all(programID) {
        const response = await fetch(this.config.byProgram.all.makeURL(programID));
        if (!response.ok) return this.badResponseMessage(programID, this.config.byProgram.all.makeURL(programID), response, programID);

        const episodes = (await response.json()).episodes;
        if (!episodes) return this.badResponseMessage(programID, this.config.byProgram.all.makeURL(programID), response, programID);

        return episodes.map(this.formatAndFilterEpisodeData);
    }

    async latest(programID) {
        const response = await fetch(this.config.byProgram.latest.makeURL(programID));
        if (!response.ok) return this.badResponseMessage(programID, this.config.byProgram.latest.makeURL(programID), response, programID);

        const episode = (await response.json()).episode;
        if (!episode) return this.badResponseMessage(programID, this.config.byProgram.latest.makeURL(programID), response, programID);

        return this.formatAndFilterEpisodeData(episode);
    }
}


module.exports = new EpisodeFetch;