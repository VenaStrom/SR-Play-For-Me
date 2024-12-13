
const contentStorageManager = new ContentStorageManager();

const audioPlayer = new AudioPlayer();

// TESTING
const time = { start: new Date().getTime(), channels: null };

const init = async () => {


    // Async Channels
    getAllChannels().then((channels) => {
        if (!channels) return;

        // Update channels in storage
        contentStorageManager.set("channels", channels);

        const likedChannelIDs = contentStorageManager.get("ids").channels;
        
        const channelParentDOM = document.querySelector("section.channels>ul");

        // Create content for all liked channels
        channels
            .filter((channel) => likedChannelIDs.includes(channel.id)) // Only liked channels
            .sort((a, b) => likedChannelIDs.indexOf(a.id) - likedChannelIDs.indexOf(b.id)) // Sort by order of liking  TODO - this won't be a sensible solution in the future
            .slice(0, 3).forEach((channel) => {
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
};

init();

// TESTING
document.addEventListener("channelsloaded", () => {
    const stats = `
Time:
 Channels: ${parseInt((time.channels - time.start))} ms`;

    console.log(stats);
});