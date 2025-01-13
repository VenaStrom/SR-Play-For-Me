"use strict";

const api = require("./api/api");

// TESTING
const time = { start: new Date().getTime(), channels: null, programs: null };

const main = async () => {
    
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