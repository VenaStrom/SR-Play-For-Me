
const api = {
    fetchCooldown: 1000, // 1 second
    uri: "https://api.sr.se/api/v2/",
    common: {
        arguments: ["format=json", "pagination=false", "audioquality=normal"],
    },
    channels: {
        suffix: "channels",
        arguments: [],
        getURI: () => `${api.uri}${api.channels.suffix}?${[...api.common.arguments, ...api.channels.arguments].join("&")}`,
    },
    programs: {
        suffix: "programs",
        arguments: ["isarchived=false"],
        getURI: () => `${api.uri}${api.programs.suffix}?${[...api.common.arguments, ...api.programs.arguments].join("&")}`,
    },
    episodes: {
        suffix: "episodes",
        arguments: [],
        getURI: (programId) => `${api.uri}${api.episodes.suffix}?programid=${programId}&${[...api.common.arguments, ...api.episodes.arguments].join("&")}`,
    },
};