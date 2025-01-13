
const config = {
    timeSpanOfEpisodes: {
        daysBack: 7,
        daysForward: 1, // API gets the episodes for the current day at 00:00 which will miss the episodes of the day
        backDate: () => new Date().setDate(new Date().getDate() - config.timeSpanOfEpisodes.daysBack),
        forwardDate: () => new Date().setDate(new Date().getDate() + config.timeSpanOfEpisodes.daysForward),
        from: () => new Date(config.timeSpanOfEpisodes.backDate).toISOString().slice(0, 10), // YYYY-MM-DD
        to: () => new Date(config.timeSpanOfEpisodes.forwardDate).toISOString().slice(0, 10), // YYYY-MM-DD
    },
    uri: "https://api.sr.se/api/v2/",
    common: {
        arguments: ["format=json", "pagination=false", "audioquality=normal"],
    },
    channels: {
        suffix: "channels",
        arguments: [],
        getURI: () => `${config.uri}${config.channels.suffix}?${[...config.common.arguments, ...config.channels.arguments].join("&")}`,
        schedule: {
            suffix: "scheduledepisodes",
            arguments: ["size=1"], // Only get the next program
            getURI: (channelId) => `${config.uri}${config.channels.schedule.suffix}?channelid=${channelId}&${[...config.common.arguments, ...config.channels.schedule.arguments].join("&")}`,
        }
    },
    programs: { // http://api.sr.se/api/v2/programs/index
        suffix: "programs/index",
        arguments: ["isarchived=false"],
        getURI: () => `${config.uri}${config.programs.suffix}?${[...config.common.arguments, ...config.programs.arguments].join("&")}`,
    },
    allEpisodes: { // http://api.sr.se/api/v2/episodes/index?programid={programID}
        suffix: "episodes/index",
        arguments: [],
        getURI: (programID) => `${config.uri}${config.allEpisodes.suffix}?programid=${programID}&${[...config.common.arguments, ...config.allEpisodes.arguments].join("&")}`,
    },
    episode: { // http://api.sr.se/api/v2/episodes/get?id={episodeID}
        suffix: "episodes/get",
        arguments: [],
        getURI: (episodeID) => `${config.uri}${config.episode.suffix}?id=${episodeID}&${[...config.common.arguments, ...config.episode.arguments].join("&")}`,
    },
    latestEpisode: { // http://api.sr.se/api/v2/episodes/getlatest?programid={programid}
        suffix: "episodes/getlatest",
        arguments: [],
        getURI: (programID) => `${config.uri}${config.latestEpisode.suffix}?programid=${programID}&${[...config.common.arguments, ...config.latestEpisode.arguments].join("&")}`,
    }
};

module.exports = { config };