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

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ChannelFetch {\n  config = {\n    all: {\n      suffix: \"channels\",\n      arguments: [],\n      makeURL: () => {\n        const query = [...this.config.all.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.all.suffix}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    }\n  };\n  badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the channels.\n            ID: ${ID}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  formatAndFilterChannelData(channelData) {\n    return {\n      id: channelData.id,\n      name: channelData.name,\n      image: channelData.image,\n      channelType: channelData.channeltype,\n      description: channelData.tagline,\n      url: channelData.liveaudio.url,\n      color: channelData.color,\n      scheduleUrl: channelData.scheduleurl\n    };\n  }\n  async all() {\n    const response = await fetch(this.config.all.makeURL());\n    if (!response.ok) return this.badResponseMessage(this.config.all.makeURL(), response);\n    const channels = (await response.json()).channels;\n    if (!channels) return this.badResponseMessage(this.config.all.makeURL(), response);\n    return channels.map(this.formatAndFilterChannelData);\n  }\n}\nmodule.exports = new ChannelFetch();\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-channels.js?");

/***/ }),

/***/ "./scripts/api/fetch-episodes.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-episodes.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass EpisodeFetch {\n  constructor() {}\n  config = {\n    byProgram: {\n      all: {\n        suffix: \"episodes/index\",\n        arguments: [],\n        makeURL: programID => {\n          if (!programID) return console.error(\"No programID provided.\");\n          const fromDate = new Date();\n          fromDate.setDate(fromDate.getDate() - commonConfig.fetchSpan.pastOffset);\n          const toDate = new Date();\n          toDate.setDate(toDate.getDate() + commonConfig.fetchSpan.futureOffset);\n          const query = [`fromDate=${fromDate}`, `toDate=${toDate}`, ...this.config.byProgram.all.arguments, ...commonConfig.arguments];\n          const path = `${commonConfig.baseURL}${this.config.byProgram.all.suffix}`;\n          return `${path}?programid=${programID}&${query.join(\"&\")}`;\n        }\n      },\n      latest: {\n        suffix: \"episodes/getlatest\",\n        arguments: [],\n        makeURL: programID => {\n          if (!programID) return console.error(\"No programID provided.\");\n          const query = [...this.config.byProgram.latest.arguments, ...commonConfig.arguments];\n          const path = `${commonConfig.baseURL}${this.config.byProgram.latest.suffix}`;\n          return `${path}?programid=${programID}&${query.join(\"&\")}`;\n        }\n      }\n    },\n    byID: {\n      suffix: \"episodes/get\",\n      arguments: [],\n      makeURL: episodeID => {\n        if (!episodeID) return console.error(\"No episodeID provided.\");\n        const query = [...this.config.byID.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byID.suffix}`;\n        return `${path}?id=${episodeID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the episode(s).\n            ID: ${ID}\n            UL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  formatAndFilterEpisodeData(episodeData) {\n    return {\n      id: episodeData.id,\n      name: episodeData.title,\n      description: episodeData.description,\n      image: episodeData.imageurl,\n      url: episodeData?.downloadpodfile?.url || episodeData?.listenpodfile?.url || null,\n      program: episodeData?.program?.name || \"\",\n      publishDate: new Date(parseInt(episodeData.publishdateutc.replace(/[^0-9]/g, \"\")) + new Date().getTimezoneOffset() * 60000)\n    };\n  }\n  async byID(episodeID) {\n    const response = await fetch(this.config.byID.makeURL(episodeID));\n    if (!response.ok) return this.badResponseMessage(episodeID, this.config.byID.makeURL(episodeID), response, episodeID);\n    const episode = (await response.json()).episode;\n    if (!episode) return this.badResponseMessage(episodeID, this.config.byID.makeURL(episodeID), response, episodeID);\n    return this.formatAndFilterEpisodeData(episode);\n  }\n  byProgram = new ByProgram();\n}\nclass ByProgram {\n  constructor() {}\n  async all(programID) {\n    const response = await fetch(this.config.byProgram.all.makeURL(programID));\n    if (!response.ok) return this.badResponseMessage(programID, this.config.byProgram.all.makeURL(programID), response, programID);\n    const episodes = (await response.json()).episodes;\n    if (!episodes) return this.badResponseMessage(programID, this.config.byProgram.all.makeURL(programID), response, programID);\n    return episodes.map(this.formatAndFilterEpisodeData);\n  }\n  async latest(programID) {\n    const response = await fetch(this.config.byProgram.latest.makeURL(programID));\n    if (!response.ok) return this.badResponseMessage(programID, this.config.byProgram.latest.makeURL(programID), response, programID);\n    const episode = (await response.json()).episode;\n    if (!episode) return this.badResponseMessage(programID, this.config.byProgram.latest.makeURL(programID), response, programID);\n    return this.formatAndFilterEpisodeData(episode);\n  }\n}\nmodule.exports = new EpisodeFetch();\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-episodes.js?");

/***/ }),

/***/ "./scripts/api/fetch-programs.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-programs.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ProgramFetch {\n  constructor() {}\n  config = {\n    all: {\n      suffix: \"programs/index\",\n      arguments: [\"isarchived=false\"],\n      makeURL: () => {\n        const query = [...this.config.all.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.all.suffix}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    },\n    byID: {\n      suffix: \"programs/\",\n      arguments: [\"isarchived=false\"],\n      makeURL: programID => {\n        if (!programID) return console.error(\"No programID provided.\");\n        const query = [...this.config.byID.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byID.suffix}${programID}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    },\n    byChannel: {\n      suffix: \"programs/index\",\n      arguments: [\"isarchived=false\"],\n      makeURL: channelID => {\n        if (!channelID) return console.error(\"No channelID provided.\");\n        const query = [...this.config.byChannel.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;\n        return `${path}?channelid=${channelID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the programs.\n            ID: ${ID}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  formatAndFilterProgramData(programData) {\n    return {\n      ID: programData.id,\n      name: programData.name,\n      description: programData.description,\n      category: programData.programcategory,\n      payoff: programData.payoff,\n      broadcastinfo: programData.broadcastinfo,\n      image: programData.programimage,\n      episodes: []\n    };\n  }\n  async all() {\n    const response = await fetch(this.config.all.makeURL());\n    if (!response.ok) return this.badResponseMessage(this.config.all.makeURL(), response);\n    const rawPrograms = (await response.json()).programs;\n    if (!rawPrograms) return this.badResponseMessage(this.config.all.makeURL(), response);\n    return rawPrograms.map(this.formatAndFilterProgramData);\n  }\n  async byID(programID) {\n    if (!programID) return console.error(\"No programID provided.\");\n    const response = await fetch(this.config.byID.makeURL(programID));\n    if (!response.ok) return this.badResponseMessage(this.config.byID.makeURL(programID), response, programID);\n    const rawProgram = (await response.json()).program;\n    if (!rawProgram) return this.badResponseMessage(this.config.byID.makeURL(programID), response, programID);\n    return this.formatAndFilterProgramData(rawProgram);\n  }\n  async byChannel(channelID) {\n    if (!channelID) return console.error(\"No channelID provided.\");\n    const response = await fetch(this.config.byChannel.makeURL(channelID));\n    if (!response.ok) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    const rawPrograms = (await response.json()).programs;\n    if (!rawPrograms) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    return rawPrograms.map(this.formatAndFilterProgramData);\n  }\n}\nmodule.exports = new ProgramFetch();\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-programs.js?");

/***/ }),

/***/ "./scripts/api/fetch-schedule.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-schedule.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ScheduleFetch {\n  constructor() {}\n  config = {\n    byChannel: {\n      suffix: \"scheduledepisodes\",\n      arguments: [],\n      makeURL: (channelID, count = 1) => {\n        if (!channelID) return console.error(\"No channelID provided.\");\n        const sizeArg = `size=${count}`;\n        const query = [sizeArg, ...this.config.byChannel.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;\n        return `${path}?channelid=${channelID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  badResponseMessage(URL, response, ID = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the schedule.\n            ID: ${ID}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  async byChannel(channelID) {\n    if (!channelID) return console.error(\"No channelID provided.\");\n    const response = await fetch(this.config.byChannel.makeURL(channelID));\n    if (!response.ok) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    const schedule = (await response.json()).schedule;\n    if (!schedule) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    return schedule;\n  }\n}\nmodule.exports = new ScheduleFetch();\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-schedule.js?");

/***/ }),

/***/ "./scripts/main.js":
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst api = __webpack_require__(/*! ./api/api */ \"./scripts/api/api.js\");\n\n// TESTING\nconst time = {\n  start: new Date().getTime(),\n  channels: null,\n  programs: null\n};\nconst main = async () => {\n  console.log(api.channel);\n  console.log(api.program);\n  console.log(api.schedule);\n  console.log(api.episode);\n};\nmain();\n\n// TESTING\ndocument.addEventListener(\"channelsloaded\", () => {\n  const timeTaken = time.channels - time.start;\n  const stats = `Channels load time: ${parseInt(timeTaken)} ms`;\n  console.log(stats);\n});\ndocument.addEventListener(\"programsloaded\", () => {\n  const timeTaken = time.programs - time.start;\n  const stats = `Programs load time: ${parseInt(timeTaken)} ms`;\n  console.log(stats);\n});\n\n//# sourceURL=webpack://vr-radio-player/./scripts/main.js?");

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