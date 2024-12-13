
getChannelSchedule = async (channelID) => {

    const uri = api.channels.schedule.getURI(channelID)

    const response = await fetch(uri);

    if (!response.ok) {
        // Might just be missing schedule for the channel
        return null;
    }

    const rawSchedule = (await response.json()).schedule.at(0);

    if (!rawSchedule) {
        // Might be an empty schedule
        return null;
    }

    return {
        title: rawSchedule.title,
        startTime: new Date(parseInt(rawSchedule.starttimeutc.replace(/[^0-9]/g, ""))),
        endTime: new Date(parseInt(rawSchedule.endtimeutc.replace(/[^0-9]/g, ""))),
    }
};

setScheduleOnVisibleChannels = async () => {
    const visibleChannels = document.querySelectorAll("section.channels>ul>li");

    visibleChannels.forEach(async (channel) => {
        const channelId = channel.id.split("-").at(-1);

        const schedule = await getChannelSchedule(channelId);

        if (schedule) {
            channel.querySelector(".footer>p").innerHTML = `Just nu:&nbsp ${schedule.title}`;
        }
    });
}