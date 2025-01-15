"use strict";

const api = require("./api/api");
const DOMMaker = require("./DOM-makers");
const AudioPlayer = require("./audio-player");

console.log(AudioPlayer);

// 
// TEMP config
// 
const config = {
    channels: {
        followed: [218, 164, 132, 701,],
    },
    programs: {
        followed: [4923,],
    },
};

const main = async () => {
    // 
    // Followed Channels
    // 
    // Skeletons
    config.channels.followed.forEach((channelID, index) => {
        const id = `channel-${channelID}`;

        const parent = document.querySelector(".channels ul");
        parent.appendChild(DOMMaker.skeleton(id));
    });
    // Data population
    config.channels.followed.forEach(async (channelID, index) => {
        const channel = await api.channel.byID(channelID);
        if (!channel) return;

        const channelData = {
            id: channel.id,
            image: channel.image,
            header: {
                title: channel.name,
                info: channel.tagline,
            },
            description: channel.description,
            footer: {
                text: channel.category,
            },
        };

        DOMMaker.populateContentDOM(channelData);

        // Play button
        const playButton = document.querySelector(`#${channelData.id} button`);

        const latestEpisodeID = (await api.schedule.latest(channelData.id)).at(0);
        console.log(latestEpisodeID);
        // console.log((await api.schedule.config.byChannel.makeURL(channelData.id.split("-")[1])).at(0));
    });
};

main();