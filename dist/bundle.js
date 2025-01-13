/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/api/api.js":
/*!****************************!*\
  !*** ./scripts/api/api.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nmodule.exports = {\n  ...__webpack_require__(/*! ./fetch-channels */ \"./scripts/api/fetch-channels.js\"),\n  ...__webpack_require__(/*! ./fetch-episodes */ \"./scripts/api/fetch-episodes.js\"),\n  ...__webpack_require__(/*! ./fetch-programs */ \"./scripts/api/fetch-programs.js\"),\n  ...__webpack_require__(/*! ./fetch-schedule */ \"./scripts/api/fetch-schedule.js\")\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/api.js?");

/***/ }),

/***/ "./scripts/api/config.js":
/*!*******************************!*\
  !*** ./scripts/api/config.js ***!
  \*******************************/
/***/ ((module) => {

eval("const config = {\n  timeSpanOfEpisodes: {\n    daysBack: 7,\n    daysForward: 1,\n    // API gets the episodes for the current day at 00:00 which will miss the episodes of the day\n    backDate: () => new Date().setDate(new Date().getDate() - config.timeSpanOfEpisodes.daysBack),\n    forwardDate: () => new Date().setDate(new Date().getDate() + config.timeSpanOfEpisodes.daysForward),\n    from: () => new Date(config.timeSpanOfEpisodes.backDate).toISOString().slice(0, 10),\n    // YYYY-MM-DD\n    to: () => new Date(config.timeSpanOfEpisodes.forwardDate).toISOString().slice(0, 10) // YYYY-MM-DD\n  },\n  uri: \"https://api.sr.se/api/v2/\",\n  common: {\n    arguments: [\"format=json\", \"pagination=false\", \"audioquality=normal\"]\n  },\n  channels: {\n    suffix: \"channels\",\n    arguments: [],\n    getURI: () => `${config.uri}${config.channels.suffix}?${[...config.common.arguments, ...config.channels.arguments].join(\"&\")}`,\n    schedule: {\n      suffix: \"scheduledepisodes\",\n      arguments: [\"size=1\"],\n      // Only get the next program\n      getURI: channelId => `${config.uri}${config.channels.schedule.suffix}?channelid=${channelId}&${[...config.common.arguments, ...config.channels.schedule.arguments].join(\"&\")}`\n    }\n  },\n  programs: {\n    // http://api.sr.se/api/v2/programs/index\n    suffix: \"programs/index\",\n    arguments: [\"isarchived=false\"],\n    getURI: () => `${config.uri}${config.programs.suffix}?${[...config.common.arguments, ...config.programs.arguments].join(\"&\")}`\n  },\n  allEpisodes: {\n    // http://api.sr.se/api/v2/episodes/index?programid={programID}\n    suffix: \"episodes/index\",\n    arguments: [],\n    getURI: programID => `${config.uri}${config.allEpisodes.suffix}?programid=${programID}&${[...config.common.arguments, ...config.allEpisodes.arguments].join(\"&\")}`\n  },\n  episode: {\n    // http://api.sr.se/api/v2/episodes/get?id={episodeID}\n    suffix: \"episodes/get\",\n    arguments: [],\n    getURI: episodeID => `${config.uri}${config.episode.suffix}?id=${episodeID}&${[...config.common.arguments, ...config.episode.arguments].join(\"&\")}`\n  },\n  latestEpisode: {\n    // http://api.sr.se/api/v2/episodes/getlatest?programid={programid}\n    suffix: \"episodes/getlatest\",\n    arguments: [],\n    getURI: programID => `${config.uri}${config.latestEpisode.suffix}?programid=${programID}&${[...config.common.arguments, ...config.latestEpisode.arguments].join(\"&\")}`\n  }\n};\nmodule.exports = {\n  config\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/config.js?");

/***/ }),

/***/ "./scripts/api/fetch-channels.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-channels.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst {\n  config\n} = __webpack_require__(/*! ./config */ \"./scripts/api/config.js\");\nconst getAllChannels = async () => {\n  const response = await fetch(config.channels.getURI());\n  if (!response.ok) {\n    console.warn(\"Didn't get a proper response from the Sveriges Radio API when fetching the channels. URL and response:\", config.channels.getURI(), response);\n    return null;\n  }\n  const rawChannels = (await response.json()).channels;\n  if (!rawChannels) {\n    console.warn(\"Didn't get any channels from the Sveriges Radio API when fetching the channels. URL and response:\", config.channels.getURI(), response);\n    return null;\n  }\n  const channels = rawChannels.map(channelData => {\n    return {\n      id: channelData.id,\n      name: channelData.name,\n      image: channelData.image,\n      channelType: channelData.channeltype,\n      description: channelData.tagline,\n      url: channelData.liveaudio.url,\n      color: channelData.color,\n      scheduleUrl: channelData.scheduleurl\n    };\n  });\n  return channels;\n};\nmodule.exports = {\n  getAllChannels\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-channels.js?");

/***/ }),

/***/ "./scripts/api/fetch-episodes.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-episodes.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst {\n  config\n} = __webpack_require__(/*! ./config */ \"./scripts/api/config.js\");\nclass EpisodeFetch {\n  constructor() {}\n  noResponseMessage(ID, URL, response) {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the episode(s).\n            ID: ${ID}\n            UL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  formatAndFilterEpisodeData(episodeData) {\n    return {\n      id: episodeData.id,\n      name: episodeData.title,\n      description: episodeData.description,\n      image: episodeData.imageurl,\n      url: episodeData?.downloadpodfile?.url || episodeData?.listenpodfile?.url || null,\n      program: episodeData?.program?.name || \"\",\n      publishDate: new Date(parseInt(episodeData.publishdateutc.replace(/[^0-9]/g, \"\")) + new Date().getTimezoneOffset() * 60000)\n    };\n  }\n  async all(programID) {\n    if (!programID) return console.error(\"No programID provided.\");\n    const response = await fetch(config.allEpisodes.getURI(programID));\n    if (!response.ok) return this.noResponseMessage(programID, config.allEpisodes.getURI(programID), response);\n    const episodes = (await response.json()).episodes;\n    return episodes.map(this.formatAndFilterEpisodeData);\n  }\n  async latest(programID) {\n    if (!programID) return console.error(\"No programID provided.\");\n    const response = await fetch(config.latestEpisode.getURI(programID));\n    if (!response.ok) return this.noResponseMessage(programID, config.latestEpisode.getURI(programID), response);\n    const episode = (await response.json()).episode;\n    return this.formatAndFilterEpisodeData(episode);\n  }\n  async single(episodeID) {\n    if (!episodeID) return console.error(\"No episodeID provided.\");\n    const response = await fetch(config.episode.getURI(episodeID));\n    if (!response.ok) return this.noResponseMessage(episodeID, config.episode.getURI(episodeID), response);\n    const episode = (await response.json()).episode;\n    return this.formatAndFilterEpisodeData(episode);\n  }\n}\nmodule.exports = {\n  EpisodeFetch\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-episodes.js?");

/***/ }),

/***/ "./scripts/api/fetch-programs.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-programs.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst {\n  config\n} = __webpack_require__(/*! ./config */ \"./scripts/api/config.js\");\nconst getAllPrograms = async () => {\n  const response = await fetch(config.programs.getURI());\n  if (!response.ok) {\n    console.warn(\"Didn't get a proper response from the Sveriges Radio API when fetching the programs. URL and response:\", config.programs.getURI(), response);\n    return null;\n  }\n  const rawPrograms = (await response.json()).programs;\n  if (!rawPrograms) {\n    console.warn(\"Didn't get any programs from the Sveriges Radio API when fetching the programs. URL and response:\", config.programs.getURI(), response);\n    return null;\n  }\n  const programs = rawPrograms.map(programData => {\n    return {\n      id: programData.id,\n      name: programData.name,\n      description: programData.description,\n      category: programData.programcategory,\n      payoff: programData.payoff,\n      broadcastinfo: programData.broadcastinfo,\n      image: programData.programimage,\n      episodes: []\n    };\n  });\n  return programs;\n};\nmodule.exports = {\n  getAllPrograms\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-programs.js?");

/***/ }),

/***/ "./scripts/api/fetch-schedule.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-schedule.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst {\n  config\n} = __webpack_require__(/*! ./config */ \"./scripts/api/config.js\");\nconst getChannelSchedule = async channelID => {\n  if (!channelID) {\n    return null;\n  }\n  const uri = config.channels.schedule.getURI(channelID);\n  const response = await fetch(uri);\n  if (!response.ok) {\n    // Might just be missing schedule for the channel\n    return null;\n  }\n  const rawSchedule = (await response.json()).schedule.at(0);\n  if (!rawSchedule) {\n    // Might be an empty schedule\n    return null;\n  }\n  const timeZoneOffset = new Date().getTimezoneOffset() * 60000;\n  return {\n    title: rawSchedule.title,\n    startTime: new Date(parseInt(rawSchedule.starttimeutc.replace(/[^0-9]/g, \"\")) + timeZoneOffset),\n    endTime: new Date(parseInt(rawSchedule.endtimeutc.replace(/[^0-9]/g, \"\")) + timeZoneOffset)\n  };\n};\nconst setScheduleOnVisibleChannels = async () => {\n  const visibleChannels = document.querySelectorAll(\"section.channels>ul>li\");\n  const promises = [];\n  for (const channel of visibleChannels) {\n    const channelId = channel.id.split(\"-\").at(-1);\n    promises.push(getChannelSchedule(channelId));\n  }\n  const schedules = await Promise.all(promises);\n  schedules.forEach((schedule, index) => {\n    if (schedule) {\n      visibleChannels[index].querySelector(\".footer>p\").innerHTML = `Just nu:&nbsp ${schedule.title}`;\n    }\n  });\n};\nmodule.exports = {\n  getChannelSchedule,\n  setScheduleOnVisibleChannels\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-schedule.js?");

/***/ }),

/***/ "./scripts/main.js":
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst api = __webpack_require__(/*! ./api/api */ \"./scripts/api/api.js\");\n\n// TESTING\nconst time = {\n  start: new Date().getTime(),\n  channels: null,\n  programs: null\n};\nconst main = async () => {};\nmain();\n\n// TESTING\ndocument.addEventListener(\"channelsloaded\", () => {\n  const timeTaken = time.channels - time.start;\n  const stats = `Channels load time: ${parseInt(timeTaken)} ms`;\n  console.log(stats);\n});\ndocument.addEventListener(\"programsloaded\", () => {\n  const timeTaken = time.programs - time.start;\n  const stats = `Programs load time: ${parseInt(timeTaken)} ms`;\n  console.log(stats);\n});\n\n//# sourceURL=webpack://vr-radio-player/./scripts/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./scripts/main.js");
/******/ 	
/******/ })()
;