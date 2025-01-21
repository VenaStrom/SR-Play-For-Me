"use strict";

const commonConfig = require("./common-config.json");

class ScheduleFetch {
    constructor() { }

    static config = {
        currentEpisodeByChannel: {
            suffix: "scheduledepisodes",
            arguments: [],
            makeURL: (channelID) => {
                if (!channelID) return console.error("No channelID provided.");
                const query = [...this.config.currentEpisodeByChannel.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.currentEpisodeByChannel.suffix}`;
                return `${path}?channelid=${channelID}&${query.join("&")}`;
            },
        },
    }

    static badResponseMessage(URL, response, id = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the schedule.
            ID: ${id}
            URL used: ${URL}
            Response: ${response}
            `.trim());
    }

    static async CurrentEpisodeByChannel(channelID) {
        if (!channelID) return console.error("No channelID provided.");
        
        if (typeof channelID === "string") channelID = channelID.replace(/\D/g, ""); // Sometimes channel-### is passed

        const response = await fetch(this.config.currentEpisodeByChannel.makeURL(channelID));
        if (!response.ok) return this.badResponseMessage(this.config.currentEpisodeByChannel.makeURL(channelID), response, channelID);

        const schedule = (await response.json()).schedule;
        if (!schedule) return this.badResponseMessage(this.config.currentEpisodeByChannel.makeURL(channelID), response, channelID);

        const scheduledEpisodes = schedule.map(episode => ({
            title: episode.title,
            id: `episode-${episode.episodeid}`,
            startTime: parseInt(episode.starttimeutc.replace(/\D/g, "")),
            endTime: parseInt(episode.endtimeutc.replace(/\D/g, "")),
        }));
        const currentlyPlayingEpisode = scheduledEpisodes.find(episode => episode.startTime < Date.now() && episode.endTime > Date.now());

        return currentlyPlayingEpisode;
    }
}

module.exports = ScheduleFetch;