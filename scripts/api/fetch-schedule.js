"use strict";

const commonConfig = require("./common-config.json");

class ScheduleFetch {
    constructor() { }

    config = {
        byChannel: {
            suffix: "scheduledepisodes",
            arguments: [],
            makeURL: (channelID, count = 1) => {
                if (!channelID) return console.error("No channelID provided.");
                const sizeArg = `size=${count}`;
                const query = [sizeArg, ...this.config.byChannel.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;
                return `${path}?channelid=${channelID}&${query.join("&")}`;
            },
        },
    }

    badResponseMessage(URL, response, ID = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the schedule.
            ID: ${ID}
            URL used: ${URL}
            Response: ${response}
            `.trim());
    }

    async byChannel(channelID) {
        if (!channelID) return console.error("No channelID provided.");

        const response = await fetch(this.config.byChannel.makeURL(channelID));
        if (!response.ok) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);

        const schedule = (await response.json()).schedule;
        if (!schedule) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);

        return schedule;
    }
}

module.exports = ScheduleFetch;