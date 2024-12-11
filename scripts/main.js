
const contentStorageManager = new ContentStorageManager();

const audioPlayer = new AudioPlayer();

const init = async () => {
    const channels = await getAllChannels();

    if (channels) {
        contentStorageManager.set("channels", channels);

        const likedChannels = contentStorageManager.get("ids").channels;

        channels
            .filter((channel) => likedChannels.includes(channel.id))
            .sort((a, b) => likedChannels.indexOf(a.id) - likedChannels.indexOf(b.id))
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

                createContentDOM(document.querySelector("section.channels>ul"), data);
            });

        setScheduleOnVisibleChannels();

        setInterval(setScheduleOnVisibleChannels, 60000); // Keep the schedule somewhat up-to-date

        // Whenever you click a start button, update the schedule
        document.body.addEventListener("startbuttonclicked", () => {
            setScheduleOnVisibleChannels();
        });
    }
};

init();