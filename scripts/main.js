
// CONFIG but probably not in the long run
const visibleEpisodes = 3;
const visibleChannels = 3;
const visiblePrograms = 3;

const contentStorageManager = new ContentStorageManager();

const audioPlayer = new AudioPlayer();

// TESTING
const time = { start: new Date().getTime(), channels: null, programs: null };

const main = async () => {
    // Async Channels
    getAllChannels().then((channels) => {
        if (!channels) return;

        // Update channels in storage
        contentStorageManager.set("channels", channels);

        const likedChannelIDs = contentStorageManager.get("ids").channels;

        const channelParentDOM = document.querySelector("section.channels>ul");

        channels
            .filter((channel) => likedChannelIDs.includes(channel.id)) // Only liked channels
            .sort((a, b) => likedChannelIDs.indexOf(a.id) - likedChannelIDs.indexOf(b.id)) // Sort by order of liking  TODO - this won't be a sensible solution in the future
            .slice(0, visibleChannels).forEach((channel) => {
                const data = {
                    id: channel.id,
                    type: "channel",
                    image: channel.image,
                    header: {
                        title: channel.name,
                        info: channel.channelType,
                    },
                    description: channel.description,
                    footer: {
                        text: "Lyssna live",
                    },
                };

                createContentDOM(channelParentDOM, data);
            });

        // Async function to get schedule for a channel and update the DOM
        setScheduleOnVisibleChannels();
        setInterval(setScheduleOnVisibleChannels, 60000); // Keep the schedule somewhat up-to-date

        // Whenever you click a start button, update the schedule
        document.body.addEventListener("startbuttonclicked", () => {
            setScheduleOnVisibleChannels();
        });

        // TESTING
        time.channels = new Date().getTime();
        document.dispatchEvent(new Event("channelsloaded"));
    });

    // Async Programs
    getAllPrograms().then((programs) => {
        if (!programs) return;

        // Update programs in storage
        contentStorageManager.set("programs", programs);

        const likedProgramIDs = contentStorageManager.get("ids").programs;

        const programParentDOM = document.querySelector("section.programs>ul");

        // Create content for all liked programs
        programs
            .filter((program) => likedProgramIDs.includes(program.id)) // Only liked programs
            .sort((a, b) => likedProgramIDs.indexOf(a.id) - likedProgramIDs.indexOf(b.id)) // Sort by order of liking  TODO - this won't be a sensible solution in the future
            .slice(0, visiblePrograms).forEach((program) => {
                const data = {
                    id: program.id,
                    type: "program",
                    image: program.image,
                    header: {
                        title: program.name,
                        info: program.broadcastinfo,
                    },
                    description: program.description + " " + program.payoff,
                    footer: {
                        text: "Lyssna senaste",
                        id: "episode-latest"
                    },
                };
                createContentDOM(programParentDOM, data);
            });

        // Async function to get latest episode for a program and update the DOM
        setLatestEpisodeOnVisiblePrograms();
        setInterval(setLatestEpisodeOnVisiblePrograms, 60000); // Keep the latest episode somewhat up-to-date

        // Whenever you click a start button, update the latest episode
        document.body.addEventListener("startbuttonclicked", () => {
            setLatestEpisodeOnVisiblePrograms();
        });

        // TESTING
        time.programs = new Date().getTime();
        document.dispatchEvent(new Event("programsloaded"));
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