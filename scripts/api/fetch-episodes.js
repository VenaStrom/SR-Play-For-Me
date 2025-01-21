"use strict";

const commonConfig = require("./common-config.json");

class EpisodeFetch {
    constructor() { }

    static config = {
        singleByID: {
            suffix: "episodes/get",
            arguments: [],
            makeURL: (episodeID) => {
                if (!episodeID) return console.error("No episodeID provided.");
                const query = [...this.config.singleByID.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.singleByID.suffix}`;
                return `${path}?id=${episodeID}&${query.join("&")}`;
            },
        },
        allByProgram: {
            suffix: "episodes/index",
            arguments: [],
            makeURL: (programID) => {
                if (!programID) return console.error("No programID provided.");

                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - commonConfig.fetchSpan.pastOffset);
                const toDate = new Date();
                toDate.setDate(toDate.getDate() + commonConfig.fetchSpan.futureOffset);

                const query = [`fromDate=${fromDate.toISOString().slice(0, 10)}`, `toDate=${toDate.toISOString().slice(0, 10)}`, ...this.config.allByProgram.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.allByProgram.suffix}`;
                return `${path}?programid=${programID}&${query.join("&")}`;
            },
        },
        latestByProgram: {
            suffix: "episodes/getlatest",
            arguments: [],
            makeURL: (programID) => {
                if (!programID) return console.error("No programID provided.");
                const query = [...this.config.latestByProgram.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.latestByProgram.suffix}`;
                return `${path}?programid=${programID}&${query.join("&")}`;
            },
        },

    }

    static badResponseMessage(URL, response, id = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the episode(s).
            ID: ${id}
            UL used: ${URL}
            Response: ${response}
            `.trim());
    }

    static formatAndFilterEpisodeData(episodeData) {
        return {
            id: `episode-${episodeData.id}`,
            name: episodeData.title,
            description: episodeData.description,
            image: episodeData.imageurl,
            url: episodeData?.downloadpodfile?.url || episodeData?.listenpodfile?.url || null,
            duration: episodeData?.downloadpodfile?.duration || episodeData?.listenpodfile?.duration || null,
            program: episodeData?.program?.name || "",
            publishDate: new Date(parseInt(episodeData.publishdateutc.replace(/[^0-9]/g, "")) + new Date().getTimezoneOffset() * 60000),
        };
    }

    static async SingleByID(episodeID) {
        if (!episodeID) return console.error("No episodeID provided.");

        if (typeof episodeID === "string") episodeID = episodeID.replace(/\D/g, ""); // Sometimes episode-### is passed

        const response = await fetch(this.config.singleByID.makeURL(episodeID));
        if (!response.ok) return this.badResponseMessage(episodeID, this.config.singleByID.makeURL(episodeID), response, episodeID);

        const episode = (await response.json()).episode;
        if (!episode) return this.badResponseMessage(episodeID, this.config.singleByID.makeURL(episodeID), response, episodeID);

        return this.formatAndFilterEpisodeData(episode);
    }

    static async AllByProgram(programID) {
        const response = await fetch(this.config.allByProgram.makeURL(programID));
        if (!response.ok) return this.badResponseMessage(programID, this.config.allByProgram.makeURL(programID), response, programID);

        const episodes = (await response.json()).episodes;
        if (!episodes) return this.badResponseMessage(programID, this.config.allByProgram.makeURL(programID), response, programID);

        return episodes.map(this.formatAndFilterEpisodeData);
    }

    static async LatestByProgram(programID) {
        const response = await fetch(this.config.latestByProgram.makeURL(programID));
        if (!response.ok) return this.badResponseMessage(programID, this.config.latestByProgram.makeURL(programID), response, programID);

        const episode = (await response.json()).episode;
        if (!episode) return this.badResponseMessage(programID, this.config.latestByProgram.makeURL(programID), response, programID);

        return this.formatAndFilterEpisodeData(episode);
    }
}

module.exports = EpisodeFetch;