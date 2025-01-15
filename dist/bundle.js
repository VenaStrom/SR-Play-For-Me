/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/api/api.js":
/*!****************************!*\
  !*** ./scripts/api/api.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nmodule.exports = {\n  channel: __webpack_require__(/*! ./fetch-channels */ \"./scripts/api/fetch-channels.js\"),\n  episode: __webpack_require__(/*! ./fetch-episodes */ \"./scripts/api/fetch-episodes.js\"),\n  program: __webpack_require__(/*! ./fetch-programs */ \"./scripts/api/fetch-programs.js\"),\n  schedule: __webpack_require__(/*! ./fetch-schedule */ \"./scripts/api/fetch-schedule.js\")\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/api.js?");

/***/ }),

/***/ "./scripts/api/fetch-channels.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-channels.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ChannelFetch {\n  constructor() {}\n  static config = {\n    all: {\n      suffix: \"channels\",\n      arguments: [],\n      makeURL: () => {\n        const query = [...this.config.all.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.all.suffix}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the channels.\n            ID: ${ID}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static formatAndFilterChannelData(channelData) {\n    return {\n      id: channelData.id,\n      name: channelData.name,\n      image: channelData.image,\n      channelType: channelData.channeltype,\n      description: channelData.tagline,\n      url: channelData.liveaudio.url,\n      color: channelData.color,\n      scheduleUrl: channelData.scheduleurl\n    };\n  }\n  static async all() {\n    const response = await fetch(ChannelFetch.config.all.makeURL());\n    if (!response.ok) return ChannelFetch.badResponseMessage(ChannelFetch.config.all.makeURL(), response);\n    const channels = (await response.json()).channels;\n    if (!channels) return ChannelFetch.badResponseMessage(ChannelFetch.config.all.makeURL(), response);\n    return channels.map(ChannelFetch.formatAndFilterChannelData);\n  }\n}\nmodule.exports = ChannelFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-channels.js?");

/***/ }),

/***/ "./scripts/api/fetch-episodes.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-episodes.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass EpisodeFetch {\n  constructor() {}\n  static config = {\n    byProgram: {\n      all: {\n        suffix: \"episodes/index\",\n        arguments: [],\n        makeURL: programID => {\n          if (!programID) return console.error(\"No programID provided.\");\n          const fromDate = new Date();\n          fromDate.setDate(fromDate.getDate() - commonConfig.fetchSpan.pastOffset);\n          const toDate = new Date();\n          toDate.setDate(toDate.getDate() + commonConfig.fetchSpan.futureOffset);\n          const query = [`fromDate=${fromDate}`, `toDate=${toDate}`, ...this.config.byProgram.all.arguments, ...commonConfig.arguments];\n          const path = `${commonConfig.baseURL}${this.config.byProgram.all.suffix}`;\n          return `${path}?programid=${programID}&${query.join(\"&\")}`;\n        }\n      },\n      latest: {\n        suffix: \"episodes/getlatest\",\n        arguments: [],\n        makeURL: programID => {\n          if (!programID) return console.error(\"No programID provided.\");\n          const query = [...this.config.byProgram.latest.arguments, ...commonConfig.arguments];\n          const path = `${commonConfig.baseURL}${this.config.byProgram.latest.suffix}`;\n          return `${path}?programid=${programID}&${query.join(\"&\")}`;\n        }\n      }\n    },\n    byID: {\n      suffix: \"episodes/get\",\n      arguments: [],\n      makeURL: episodeID => {\n        if (!episodeID) return console.error(\"No episodeID provided.\");\n        const query = [...this.config.byID.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byID.suffix}`;\n        return `${path}?id=${episodeID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the episode(s).\n            ID: ${ID}\n            UL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static formatAndFilterEpisodeData(episodeData) {\n    return {\n      id: episodeData.id,\n      name: episodeData.title,\n      description: episodeData.description,\n      image: episodeData.imageurl,\n      url: episodeData?.downloadpodfile?.url || episodeData?.listenpodfile?.url || null,\n      program: episodeData?.program?.name || \"\",\n      publishDate: new Date(parseInt(episodeData.publishdateutc.replace(/[^0-9]/g, \"\")) + new Date().getTimezoneOffset() * 60000)\n    };\n  }\n  static async byID(episodeID) {\n    const response = await fetch(EpisodeFetch.config.byID.makeURL(episodeID));\n    if (!response.ok) return EpisodeFetch.badResponseMessage(episodeID, EpisodeFetch.config.byID.makeURL(episodeID), response, episodeID);\n    const episode = (await response.json()).episode;\n    if (!episode) return EpisodeFetch.badResponseMessage(episodeID, EpisodeFetch.config.byID.makeURL(episodeID), response, episodeID);\n    return EpisodeFetch.formatAndFilterEpisodeData(episode);\n  }\n}\nclass ByProgram {\n  constructor() {}\n  static async all(programID) {\n    const response = await fetch(EpisodeFetch.config.byProgram.all.makeURL(programID));\n    if (!response.ok) return EpisodeFetch.badResponseMessage(programID, EpisodeFetch.config.byProgram.all.makeURL(programID), response, programID);\n    const episodes = (await response.json()).episodes;\n    if (!episodes) return EpisodeFetch.badResponseMessage(programID, EpisodeFetch.config.byProgram.all.makeURL(programID), response, programID);\n    return episodes.map(EpisodeFetch.formatAndFilterEpisodeData);\n  }\n  static async latest(programID) {\n    const response = await fetch(EpisodeFetch.config.byProgram.latest.makeURL(programID));\n    if (!response.ok) return EpisodeFetch.badResponseMessage(programID, EpisodeFetch.config.byProgram.latest.makeURL(programID), response, programID);\n    const episode = (await response.json()).episode;\n    if (!episode) return EpisodeFetch.badResponseMessage(programID, EpisodeFetch.config.byProgram.latest.makeURL(programID), response, programID);\n    return EpisodeFetch.formatAndFilterEpisodeData(episode);\n  }\n}\nEpisodeFetch.byProgram = ByProgram;\nmodule.exports = EpisodeFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-episodes.js?");

/***/ }),

/***/ "./scripts/api/fetch-programs.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-programs.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ProgramFetch {\n  constructor() {}\n  static config = {\n    all: {\n      suffix: \"programs/index\",\n      arguments: [\"isarchived=false\"],\n      makeURL: () => {\n        const query = [...this.config.all.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.all.suffix}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    },\n    byID: {\n      suffix: \"programs/\",\n      arguments: [\"isarchived=false\"],\n      makeURL: programID => {\n        if (!programID) return console.error(\"No programID provided.\");\n        const query = [...this.config.byID.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byID.suffix}${programID}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    },\n    byChannel: {\n      suffix: \"programs/index\",\n      arguments: [\"isarchived=false\"],\n      makeURL: channelID => {\n        if (!channelID) return console.error(\"No channelID provided.\");\n        const query = [...this.config.byChannel.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;\n        return `${path}?channelid=${channelID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the programs.\n            ID: ${ID}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static formatAndFilterProgramData(programData) {\n    return {\n      ID: programData.id,\n      name: programData.name,\n      description: programData.description,\n      category: programData.programcategory,\n      payoff: programData.payoff,\n      broadcastinfo: programData.broadcastinfo,\n      image: programData.programimage,\n      episodes: []\n    };\n  }\n  static async all() {\n    const response = await fetch(ProgramFetch.config.all.makeURL());\n    if (!response.ok) return ProgramFetch.badResponseMessage(ProgramFetch.config.all.makeURL(), response);\n    const rawPrograms = (await response.json()).programs;\n    if (!rawPrograms) return ProgramFetch.badResponseMessage(ProgramFetch.config.all.makeURL(), response);\n    return rawPrograms.map(ProgramFetch.formatAndFilterProgramData);\n  }\n  static async byID(programID) {\n    if (!programID) return console.error(\"No programID provided.\");\n    const response = await fetch(ProgramFetch.config.byID.makeURL(programID));\n    if (!response.ok) return ProgramFetch.badResponseMessage(ProgramFetch.config.byID.makeURL(programID), response, programID);\n    const rawProgram = (await response.json()).program;\n    if (!rawProgram) return ProgramFetch.badResponseMessage(ProgramFetch.config.byID.makeURL(programID), response, programID);\n    return ProgramFetch.formatAndFilterProgramData(rawProgram);\n  }\n  static async byChannel(channelID) {\n    if (!channelID) return console.error(\"No channelID provided.\");\n    const response = await fetch(ProgramFetch.config.byChannel.makeURL(channelID));\n    if (!response.ok) return ProgramFetch.badResponseMessage(ProgramFetch.config.byChannel.makeURL(channelID), response, channelID);\n    const rawPrograms = (await response.json()).programs;\n    if (!rawPrograms) return ProgramFetch.badResponseMessage(ProgramFetch.config.byChannel.makeURL(channelID), response, channelID);\n    return rawPrograms.map(ProgramFetch.formatAndFilterProgramData);\n  }\n}\nmodule.exports = ProgramFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-programs.js?");

/***/ }),

/***/ "./scripts/api/fetch-schedule.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-schedule.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ScheduleFetch {\n  constructor() {}\n  static config = {\n    byChannel: {\n      suffix: \"scheduledepisodes\",\n      arguments: [],\n      makeURL: (channelID, count = 1) => {\n        if (!channelID) return console.error(\"No channelID provided.\");\n        const sizeArg = `size=${count}`;\n        const query = [sizeArg, ...this.config.byChannel.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;\n        return `${path}?channelid=${channelID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the schedule.\n            ID: ${ID}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static async byChannel(channelID) {\n    if (!channelID) return console.error(\"No channelID provided.\");\n    const response = await fetch(ScheduleFetch.config.byChannel.makeURL(channelID));\n    if (!response.ok) return ScheduleFetch.badResponseMessage(ScheduleFetch.config.byChannel.makeURL(channelID), response, channelID);\n    const schedule = (await response.json()).schedule;\n    if (!schedule) return ScheduleFetch.badResponseMessage(ScheduleFetch.config.byChannel.makeURL(channelID), response, channelID);\n    return schedule;\n  }\n}\nmodule.exports = ScheduleFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-schedule.js?");

/***/ }),

/***/ "./scripts/main.js":
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst api = __webpack_require__(/*! ./api/api */ \"./scripts/api/api.js\");\n\n// TESTING\nconst time = {\n  start: new Date().getTime(),\n  channels: null,\n  programs: null\n};\nconst main = async () => {};\nmain();\n\n// TESTING\ndocument.addEventListener(\"channelsloaded\", () => {\n  const timeTaken = time.channels - time.start;\n  const stats = `Channels load time: ${parseInt(timeTaken)} ms`;\n  console.log(stats);\n});\ndocument.addEventListener(\"programsloaded\", () => {\n  const timeTaken = time.programs - time.start;\n  const stats = `Programs load time: ${parseInt(timeTaken)} ms`;\n  console.log(stats);\n});\n\n//# sourceURL=webpack://vr-radio-player/./scripts/main.js?");

/***/ }),

/***/ "./scripts/api/common-config.json":
/*!****************************************!*\
  !*** ./scripts/api/common-config.json ***!
  \****************************************/
/***/ ((module) => {

eval("module.exports = /*#__PURE__*/JSON.parse('{\"baseURL\":\"https://api.sr.se/api/v2/\",\"fetchSpan\":{\"pastOffset\":7,\"futureOffset\":1},\"arguments\":[\"format=json\",\"pagination=false\",\"audioquality=normal\"]}');\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/common-config.json?");

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