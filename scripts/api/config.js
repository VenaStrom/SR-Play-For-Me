
const api = {
    timeSpanOfEpisodes: {
        daysBack: 7,
        daysForward: 1, // API gets the episodes for the current day at 00:00 which will miss the episodes of the day
        backDate: () => new Date().setDate(new Date().getDate() - api.timeSpanOfEpisodes.daysBack),
        forwardDate: () => new Date().setDate(new Date().getDate() + api.timeSpanOfEpisodes.daysForward),
        from: () => new Date(api.timeSpanOfEpisodes.backDate).toISOString().slice(0, 10), // YYYY-MM-DD
        to: () => new Date(api.timeSpanOfEpisodes.forwardDate).toISOString().slice(0, 10), // YYYY-MM-DD
    },
    uri: "https://api.sr.se/api/v2/",
    common: {
        arguments: ["format=json", "pagination=false", "audioquality=normal"],
    },
    channels: {
        suffix: "channels",
        arguments: [],
        getURI: () => `${api.uri}${api.channels.suffix}?${[...api.common.arguments, ...api.channels.arguments].join("&")}`,
        schedule: {
            suffix: "scheduledepisodes",
            arguments: ["size=1"], // Only get the next program
            getURI: (channelId) => `${api.uri}${api.channels.schedule.suffix}?channelid=${channelId}&${[...api.common.arguments, ...api.channels.schedule.arguments].join("&")}`,
        }
    },
    programs: { // http://api.sr.se/api/v2/programs/index
        suffix: "programs/index",
        arguments: ["isarchived=false"],
        getURI: () => `${api.uri}${api.programs.suffix}?${[...api.common.arguments, ...api.programs.arguments].join("&")}`,
    },
    allEpisodes: { // http://api.sr.se/api/v2/episodes/index?programid={programID}
        suffix: "episodes/index",
        arguments: [],
        getURI: (programID) => `${api.uri}${api.allEpisodes.suffix}?programid=${programID}&${[...api.common.arguments, ...api.allEpisodes.arguments].join("&")}`,
    },
    episode: { // http://api.sr.se/api/v2/episodes/get?id={episodeID}
        suffix: "episodes/get",
        arguments: [],
        getURI: (episodeID) => `${api.uri}${api.episode.suffix}?id=${episodeID}&${[...api.common.arguments, ...api.episode.arguments].join("&")}`,
    },
    latestEpisode: { // http://api.sr.se/api/v2/episodes/getlatest?programid={programid}
        suffix: "episodes/getlatest",
        arguments: [],
        getURI: (programID) => `${api.uri}${api.latestEpisode.suffix}?programid=${programID}&${[...api.common.arguments, ...api.latestEpisode.arguments].join("&")}`,
    }
};