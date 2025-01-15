"use strict";

const commonConfig = require("./common-config.json");

class ChannelFetch {
    config = {
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

    badResponseMessage(URL, response, ID = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the channels.
            ID: ${ID}
            URL used: ${URL}
            Response: ${response}
            `.trim());
    }

    formatAndFilterChannelData(channelData) {
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

    async all() {
        const response = await fetch(this.config.all.makeURL());
        if (!response.ok) return this.badResponseMessage(this.config.all.makeURL(), response);

        const channels = (await response.json()).channels;
        if (!channels) return this.badResponseMessage(this.config.all.makeURL(), response);

        return channels.map(this.formatAndFilterChannelData);
    }
}

module.exports = new ChannelFetch;