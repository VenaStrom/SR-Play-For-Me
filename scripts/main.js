"use strict";

const api = require("./api/api");
// const ImageLoader = require("./image-loader");
const createContentDOM = require("./dom-generators/content-dom");
const DOMMaker = require("./DOM-makers");

// TESTING
const time = { start: new Date().getTime(), channels: null, programs: null };

// 
// TEMP config
// 
const config = {
    channels: {
        limit: 3,
        followed: [218, 164, 132, 701,],
    },
    programs: {
        limit: 3,
        followed: [4923,],
    },
};

const main = async () => {
    //
    // Preload default images
    //
    const _ = new Image();
    _.src = "assets/images/image-missing.png";

    // 
    // Followed Channels
    // 
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

        // createContentDOM(document.querySelector(".channels ul"), channelData, "channel");
        const parent = document.querySelector(".channels ul");
        parent.appendChild(DOMMaker.skeleton(channelData.id));

        // // TODO - reconsider this solution for ordering
        // const channelDOM = document.querySelector(`#${channelData.id}`);
        // channelDOM.style.order = index;

        // TESTING
        if (index === config.channels.followed.length - 1) {
            time.channels = new Date().getTime();
            document.dispatchEvent(new Event("channelsloaded"));
        }
    });
};

main();

// TESTING
document.addEventListener("channelsloaded", () => {
    const timeTaken = time.channels - time.start;

    const stats = `Channels load time: ${parseInt(timeTaken)} ms`;

    console.log(stats);
});

document.addEventListener("programsloaded", () => {
    const timeTaken = time.programs - time.start;

    const stats = `Programs load time: ${parseInt(timeTaken)} ms`;

    console.log(stats);
});