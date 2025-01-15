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
    }

    static badResponseMessage(URL, response, ID = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the channels.
            ID: ${ID}
            URL used: ${URL}
            Response: ${response}
            `.trim());
    }

    static formatAndFilterChannelData(channelData) {
        return {
            id: channelData.id,
            name: channelData.name,
            image: channelData.image,
            channelType: channelData.channeltype,
            description: channelData.tagline,
            url: channelData.liveaudio.url,
            color: channelData.color,
            scheduleUrl: channelData.scheduleurl,
        }
    }

    static async all() {
        const response = await fetch(ChannelFetch.config.all.makeURL());
        if (!response.ok) return ChannelFetch.badResponseMessage(ChannelFetch.config.all.makeURL(), response);

        const channels = (await response.json()).channels;
        if (!channels) return ChannelFetch.badResponseMessage(ChannelFetch.config.all.makeURL(), response);

        return channels.map(ChannelFetch.formatAndFilterChannelData);
    }
}

module.exports = ChannelFetch;