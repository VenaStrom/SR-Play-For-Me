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
        followed: [4923, 178, 2778,],
    },
};

const main = async () => {    
    // 
    // New Episodes
    // 
    // Hardcoded skeletons
    const newEpisodesSkeletons =3;
    for (let i = 0; i < newEpisodesSkeletons; i++) {
        const id = `episode-${i}`;

        const parent = document.querySelector(".episodes ul");
        parent.appendChild(DOMMaker.skeleton(id));
    }

    // 
    // Followed programs
    // 
    // Skeletons
    config.programs.followed.forEach((programID, index) => {
        const id = `program-${programID}`;

        const parent = document.querySelector(".programs ul");
        parent.appendChild(DOMMaker.skeleton(id));
    });
    // Data population
    config.programs.followed.forEach(async (programID, index) => {
        const program = await api.program.SingleByID(programID);
        if (!program) return;

        const latestEpisode = await api.episode.LatestByProgram(programID);

        const DOMData = {
            id: program.id,
            image: program.image,
            type: "program", // Affects styling
            header: {
                title: program.name,
                info: program.channelName,
            },
            description: program.description,
            footer: {
                buttonFunction: `startTrackURL(this)`,
                text: latestEpisode.name,
                buttonData: { playUrl: latestEpisode.url },
            },
        };

        DOMMaker.populateContentDOM(DOMData);
    });

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
        const channel = await api.channel.SingleByID(channelID);
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
        const currentlyPlayingEpisode = await api.schedule.CurrentEpisodeByChannel(channelID);
        footerText.textContent = currentlyPlayingEpisode.title;
    });
};

main();