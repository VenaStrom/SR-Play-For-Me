"use strict";

const api = require("./api/api");
const DOMMaker = require("./DOM-makers");
const AudioPlayer = require("./audio-player");

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
            type: "channel", // Affects styling
            header: {
                title: channel.name,
                info: channel.channelType,
            },
            description: channel.description,
            footer: {
                text: channel.category,
            },
        };

        DOMMaker.populateContentDOM(channelData);

        // Play button data
        const playButton = document.querySelector(`#${channelData.id} button`);
        const footerText = document.querySelector(`#${channelData.id} .footer>p`);

        const currentlyPlayingEpisode = await api.schedule.currentlyPlaying(channelID);

        playButton.dataset.playId = `episode-${currentlyPlayingEpisode.episodeid}`;
        footerText.textContent = `${currentlyPlayingEpisode.title}`;
    });
};

main();