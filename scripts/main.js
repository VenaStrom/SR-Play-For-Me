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

        const DOMData = {
            id: channel.id,
            image: channel.image,
            type: "channel", // Affects styling
            header: {
                title: channel.name,
                info: channel.channelType,
            },
            description: channel.description,
            footer: {
                buttonFunction: `startTrackURL(this)`,
                buttonData: { playUrl: channel.url, progressOverride: true },
            },
        };

        DOMMaker.populateContentDOM(DOMData);

        // Show currently playing episode name
        const footerText = document.querySelector(`#${DOMData.id} .footer>p`);
        const currentlyPlayingEpisode = await api.schedule.currentlyPlaying(channelID);
        footerText.textContent = currentlyPlayingEpisode.title;
    });
};

main();