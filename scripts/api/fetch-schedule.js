
const getChannelSchedule = async (channelID) => {
    if (!channelID) {
        return null;
    }

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

    const timeZoneOffset = new Date().getTimezoneOffset() * 60000;

    return {
        title: rawSchedule.title,
        startTime: new Date(parseInt(rawSchedule.starttimeutc.replace(/[^0-9]/g, "")) + timeZoneOffset),
        endTime: new Date(parseInt(rawSchedule.endtimeutc.replace(/[^0-9]/g, "")) + timeZoneOffset),
    }
};

const setScheduleOnVisibleChannels = async () => {
    const visibleChannels = document.querySelectorAll("section.channels>ul>li");

    const promises = [];

    for (const channel of visibleChannels) {
        const channelId = channel.id.split("-").at(-1);

        promises.push(getChannelSchedule(channelId));
    }

    const schedules = await Promise.all(promises);

    schedules.forEach((schedule, index) => {
        if (schedule) {
            visibleChannels[index].querySelector(".footer>p").innerHTML = `Just nu:&nbsp ${schedule.title}`;
        }
    });
}