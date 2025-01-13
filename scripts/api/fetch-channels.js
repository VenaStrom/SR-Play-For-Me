"use strict";

const { config } = require("./config");

const getAllChannels = async () => {
    const response = await fetch(config.channels.getURI());

    if (!response.ok) {
        console.warn("Didn't get a proper response from the Sveriges Radio API when fetching the channels. URL and response:", config.channels.getURI(), response,);
        return null;
    }

    const rawChannels = (await response.json()).channels;

    if (!rawChannels) {
        console.warn("Didn't get any channels from the Sveriges Radio API when fetching the channels. URL and response:", config.channels.getURI(), response,);
        return null;
    }

    const channels = rawChannels.map((channelData) => {
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
    });

    return channels;
};

module.exports = { getAllChannels };