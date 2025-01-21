"use strict";

// const storageManager = require("./storage-manager");
const api = require("./api/api");
const DOMMaker = require("./DOM-makers");
const AudioPlayer = require("./audio-player"); // Used by DOM button elements

// 
// TEMP config
// 
const config = {
    channels: {
        followed: [218, 164, 132, 701,],
        showCount: 3,
    },
    programs: {
        followed: [4923, 178, 2778,],
        showCount: 3,
    },
    episodes: {
        showCount: 3,
    },
};

const main = async () => {
    // 
    // New Episodes
    // 
    // Hardcoded skeletons
    new Array(config.episodes.showCount).fill().forEach(async (_, index) => {
        const id = `skeleton-episode-${index}`;

        const parent = document.querySelector(".episodes ul");
        parent.appendChild(DOMMaker.skeleton(id));
    });
    // Data population
    (async () => {
        const episodePromises = [];

        config.programs.followed.forEach(programID => {
            episodePromises.push(api.episode.AllByProgram(programID));
        });

        const episodes = (await Promise.all(episodePromises))
            .flat()
            .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

        episodes.slice(0, config.episodes.showCount).forEach((episode, index) => {
            const skeleton = document.querySelector(`#skeleton-episode-${index}`);
            skeleton.id = episode.id;

            const durationInMinutes = Math.floor(episode.duration / 60);
            const date = `${episode.publishDate.toLocaleDateString("sv-SE", { month: "short", day: "numeric" }).replace(".", "")} kl ${episode.publishDate.toLocaleTimeString("sv-SE", { hour: "numeric", minute: "numeric" })}`;

            const DOMData = {
                id: episode.id,
                image: episode.image,
                type: "episode", // Affects styling
                header: {
                    title: episode.name,
                    info: date,
                },
                description: episode.description,
                footer: {
                    buttonFunction: `startTrackURL(this)`,
                    time: `${durationInMinutes} min`,
                    text: "",
                    buttonData: { playUrl: episode.url, text: episode.name },
                },
            };

            DOMMaker.populateContentDOM(DOMData);
        });
    })()

    // 
    // Followed programs
    // 
    // Skeletons
    config.programs.followed.slice(0, config.programs.showCount).forEach((programID, index) => {
        const id = `program-${programID}`;

        const parent = document.querySelector(".programs ul");
        parent.appendChild(DOMMaker.skeleton(id));
    });
    // Data population
    config.programs.followed.slice(0, config.programs.showCount).forEach(async programID => {
        const program = await api.program.SingleByID(programID);
        if (!program) return;

        const latestEpisode = await api.episode.LatestByProgram(programID);
        const durationInMinutes = Math.floor(latestEpisode.duration / 60);

        const DOMData = {
            id: program.id,
            image: program.image,
            type: "program", // Affects styling
            header: {
                title: program.name,
                // info: program.broadcastinfo,
            },
            description: program.description,
            footer: {
                buttonFunction: `startTrackURL(this)`,
                time: `${durationInMinutes} min`,
                text: latestEpisode.name,
                buttonData: { playUrl: latestEpisode.url, text: latestEpisode.name },
            },
        };

        DOMMaker.populateContentDOM(DOMData);
    });

    // 
    // Followed Channels
    // 
    // Skeletons
    config.channels.followed.slice(0, config.episodes.showCount).forEach(channelID => {
        const id = `channel-${channelID}`;

        const parent = document.querySelector(".channels ul");
        parent.appendChild(DOMMaker.skeleton(id));
    });
    // Data population
    config.channels.followed.slice(0, config.episodes.showCount).forEach(async channelID => {
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
                buttonData: { playUrl: channel.url, progressOverride: true, text: channel.name },
            },
        };

        DOMMaker.populateContentDOM(DOMData);

        // Show currently playing episode name
        const footerText = document.querySelector(`#${DOMData.id} .footer>.text`);
        const currentlyPlayingEpisode = await api.schedule.CurrentEpisodeByChannel(channelID);
        footerText.textContent = currentlyPlayingEpisode.title;
    });
};

main();