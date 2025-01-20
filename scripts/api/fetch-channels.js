"use strict";

const commonConfig = require("./common-config.json");

class ChannelFetch {
    constructor() { }

    static config = {
        all: {
            suffix: "channels",
            arguments: [],
            makeURL: () => {
                const query = [...this.config.all.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.all.suffix}`;
                return `${path}?${query.join("&")}`;
            },
        },
        byID: {
            suffix: "channels",
            arguments: [],
            makeURL: (channelID) => {
                const query = [...this.config.byID.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.byID.suffix}/${channelID}`;
                return `${path}?${query.join("&")}`;
            },
        },
    }

    static badResponseMessage(URL, response, id = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the channels.
            ID: ${id}
            URL used: ${URL}
            Response: ${response}
            `.trim());
    }

    static formatAndFilterChannelData(channelData) {
        return {
            id: `channel-${channelData.id}`,
            name: channelData.name,
            image: channelData.image,
            channelType: channelData.channeltype,
            description: channelData.tagline,
            url: channelData.liveaudio.url,
            color: channelData.color,
            scheduleUrl: channelData.scheduleurl,
        }
    }

    static async All() {
        const response = await fetch(this.config.all.makeURL());
        if (!response.ok) return this.badResponseMessage(this.config.all.makeURL(), response);

        const channels = (await response.json()).channels;
        if (!channels) return this.badResponseMessage(this.config.all.makeURL(), response);

        return channels.map(this.formatAndFilterChannelData);
    }

    static async SingleByID(channelID) {
        if (!channelID) return console.warn("No channel ID provided to fetch channel by ID.");

        if (typeof channelID === "string") channelID = channelID.replace(/\D/g, ""); // Sometimes channel-### is passed

        const response = await fetch(this.config.byID.makeURL(channelID));
        if (!response.ok) return this.badResponseMessage(this.config.byID.makeURL(channelID), response, channelID);

        const channel = (await response.json()).channel;
        if (!channel) return this.badResponseMessage(this.config.byID.makeURL(channelID), response, channelID);

        return this.formatAndFilterChannelData(channel);
    }
}

module.exports = ChannelFetch;