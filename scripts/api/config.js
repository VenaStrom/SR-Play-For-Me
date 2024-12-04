
const api = {
    uri: "https://api.sr.se/api/v2/",
    common: {
        arguments: ["format=json", "pagination=false", "audioquality=normal"],
    },
    allChannels: {
        suffix: "channels",
        arguments: [],
        getURI: () => `${api.uri}${api.allChannels.suffix}?${[...api.common.arguments, ...api.allChannels.arguments].join("&")}`,
    },
    allPrograms: {
        suffix: "programs",
        arguments: [],
        getURI: () => `${api.uri}${api.allPrograms.suffix}?${[...api.common.arguments, ...api.allPrograms.arguments].join("&")}`,
    },
    episodes: {
        suffix: "episodes",
        arguments: [],
        getURI: (programId) => `${api.uri}${api.episodes.suffix}?programid=${programId}&${[...api.common.arguments, ...api.episodes.arguments].join("&")}`,
    },
};