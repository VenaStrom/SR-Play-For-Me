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

/***/ "./scripts/DOM-makers.js":
/*!*******************************!*\
  !*** ./scripts/DOM-makers.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst api = __webpack_require__(/*! ./api/api */ \"./scripts/api/api.js\");\nconst ImageLoader = __webpack_require__(/*! ./image-loader */ \"./scripts/image-loader.js\");\nclass DOMMaker {\n  constructor() {}\n  static htmlFromString(htmlFormattedString) {\n    const launderer = document.createElement(\"a\");\n    launderer.innerHTML = htmlFormattedString.trim();\n    return launderer.firstChild;\n  }\n  static async populateContentDOM(data) {\n    if (!data) return console.error(\"No data to populate DOM with. ID:\", data.id);\n    const defaultImagePath = \"assets/images/image-missing.png\";\n    const replacementDOM = this.htmlFromString(`\n        <li class=\"${data.type || \"content\"}-dom\" id=\"${data.id}\">\n            <img src=\"${defaultImagePath}\" alt=\"Bild\">\n\n            <div class=\"body\">\n                <div class=\"header\">\n                    <p class=\"title\">${data.header.title || \"Saknar titel\"}</p>\n                    <p class=\"info\">${data.header.info || \"\"}</p>\n                </div>\n\n                <p class=\"description\">${data.description || \"\"}</p>\n\n                <div class=\"footer\">\n                    <p>${data?.footer?.text || \"\"}</p>\n\n                    <button onclick=\"${data?.footer?.buttonFunction || \"\"}\">\n                        <img src=\"assets/icons/icons8-play-48.png\" alt=\"Spela\">\n                    </button>\n                </div>\n            </div>\n        </li>`);\n\n    // Dataset on button\n    if (data?.footer?.buttonData) {\n      const button = replacementDOM.querySelector(\"button\");\n      Object.entries(data.footer.buttonData).forEach(([key, value]) => {\n        button.dataset[key] = value;\n      });\n    }\n    const targetDOM = document.querySelector(`#${data.id}`);\n    targetDOM.replaceWith(replacementDOM);\n\n    // Async image loading\n    const imgDOM = replacementDOM.querySelector(`#${data.id} img`);\n    ImageLoader.asyncLoad(imgDOM, data.image || defaultImagePath, defaultImagePath);\n  }\n  static skeleton(id) {\n    return this.htmlFromString(`\n        <li class=\"content-dom\" id=\"${id}\">\n            <img src=\"assets/images/image-missing.png\" alt=\"Bild\">\n\n            <div class=\"body\">\n                <div class=\"header\">\n                    <p class=\"title\"></p>\n                    <p class=\"info\"></p>\n                </div>\n            </div>\n        </li>`);\n  }\n}\nmodule.exports = DOMMaker;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/DOM-makers.js?");

/***/ }),

/***/ "./scripts/api/api.js":
/*!****************************!*\
  !*** ./scripts/api/api.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nmodule.exports = {\n  channel: __webpack_require__(/*! ./fetch-channels */ \"./scripts/api/fetch-channels.js\"),\n  episode: __webpack_require__(/*! ./fetch-episodes */ \"./scripts/api/fetch-episodes.js\"),\n  program: __webpack_require__(/*! ./fetch-programs */ \"./scripts/api/fetch-programs.js\"),\n  schedule: __webpack_require__(/*! ./fetch-schedule */ \"./scripts/api/fetch-schedule.js\")\n};\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/api.js?");

/***/ }),

/***/ "./scripts/api/fetch-channels.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-channels.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ChannelFetch {\n  constructor() {}\n  static config = {\n    all: {\n      suffix: \"channels\",\n      arguments: [],\n      makeURL: () => {\n        const query = [...this.config.all.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.all.suffix}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    },\n    byID: {\n      suffix: \"channels\",\n      arguments: [],\n      makeURL: channelID => {\n        const query = [...this.config.byID.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byID.suffix}/${channelID}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, id = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the channels.\n            ID: ${id}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static formatAndFilterChannelData(channelData) {\n    return {\n      id: `channel-${channelData.id}`,\n      name: channelData.name,\n      image: channelData.image,\n      channelType: channelData.channeltype,\n      description: channelData.tagline,\n      url: channelData.liveaudio.url,\n      color: channelData.color,\n      scheduleUrl: channelData.scheduleurl\n    };\n  }\n  static async All() {\n    const response = await fetch(this.config.all.makeURL());\n    if (!response.ok) return this.badResponseMessage(this.config.all.makeURL(), response);\n    const channels = (await response.json()).channels;\n    if (!channels) return this.badResponseMessage(this.config.all.makeURL(), response);\n    return channels.map(this.formatAndFilterChannelData);\n  }\n  static async SingleByID(channelID) {\n    if (!channelID) return console.warn(\"No channel ID provided to fetch channel by ID.\");\n    if (typeof channelID === \"string\") channelID = channelID.replace(/\\D/g, \"\"); // Sometimes channel-### is passed\n\n    const response = await fetch(this.config.byID.makeURL(channelID));\n    if (!response.ok) return this.badResponseMessage(this.config.byID.makeURL(channelID), response, channelID);\n    const channel = (await response.json()).channel;\n    if (!channel) return this.badResponseMessage(this.config.byID.makeURL(channelID), response, channelID);\n    return this.formatAndFilterChannelData(channel);\n  }\n}\nmodule.exports = ChannelFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-channels.js?");

/***/ }),

/***/ "./scripts/api/fetch-episodes.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-episodes.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass EpisodeFetch {\n  constructor() {}\n  static config = {\n    byProgram: {\n      all: {\n        suffix: \"episodes/index\",\n        arguments: [],\n        makeURL: programID => {\n          if (!programID) return console.error(\"No programID provided.\");\n          const fromDate = new Date();\n          fromDate.setDate(fromDate.getDate() - commonConfig.fetchSpan.pastOffset);\n          const toDate = new Date();\n          toDate.setDate(toDate.getDate() + commonConfig.fetchSpan.futureOffset);\n          const query = [`fromDate=${fromDate}`, `toDate=${toDate}`, ...this.config.byProgram.all.arguments, ...commonConfig.arguments];\n          const path = `${commonConfig.baseURL}${this.config.byProgram.all.suffix}`;\n          return `${path}?programid=${programID}&${query.join(\"&\")}`;\n        }\n      },\n      latest: {\n        suffix: \"episodes/getlatest\",\n        arguments: [],\n        makeURL: programID => {\n          if (!programID) return console.error(\"No programID provided.\");\n          const query = [...this.config.byProgram.latest.arguments, ...commonConfig.arguments];\n          const path = `${commonConfig.baseURL}${this.config.byProgram.latest.suffix}`;\n          return `${path}?programid=${programID}&${query.join(\"&\")}`;\n        }\n      }\n    },\n    byID: {\n      suffix: \"episodes/get\",\n      arguments: [],\n      makeURL: episodeID => {\n        if (!episodeID) return console.error(\"No episodeID provided.\");\n        const query = [...this.config.byID.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byID.suffix}`;\n        return `${path}?id=${episodeID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, id = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the episode(s).\n            ID: ${id}\n            UL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static formatAndFilterEpisodeData(episodeData) {\n    return {\n      id: `episode-${episodeData.id}`,\n      name: episodeData.title,\n      description: episodeData.description,\n      image: episodeData.imageurl,\n      url: episodeData?.downloadpodfile?.url || episodeData?.listenpodfile?.url || null,\n      program: episodeData?.program?.name || \"\",\n      publishDate: new Date(parseInt(episodeData.publishdateutc.replace(/[^0-9]/g, \"\")) + new Date().getTimezoneOffset() * 60000)\n    };\n  }\n  static async SingleByID(episodeID) {\n    if (!episodeID) return console.error(\"No episodeID provided.\");\n    if (typeof episodeID === \"string\") episodeID = episodeID.replace(/\\D/g, \"\"); // Sometimes episode-### is passed\n\n    const response = await fetch(this.config.byID.makeURL(episodeID));\n    if (!response.ok) return this.badResponseMessage(episodeID, this.config.byID.makeURL(episodeID), response, episodeID);\n    const episode = (await response.json()).episode;\n    if (!episode) return this.badResponseMessage(episodeID, this.config.byID.makeURL(episodeID), response, episodeID);\n    return this.formatAndFilterEpisodeData(episode);\n  }\n  static async AllByProgram(programID) {\n    const response = await fetch(this.config.byProgram.all.makeURL(programID));\n    if (!response.ok) return this.badResponseMessage(programID, this.config.byProgram.all.makeURL(programID), response, programID);\n    const episodes = (await response.json()).episodes;\n    if (!episodes) return this.badResponseMessage(programID, this.config.byProgram.all.makeURL(programID), response, programID);\n    return episodes.map(this.formatAndFilterEpisodeData);\n  }\n  static async LatestByProgram(programID) {\n    const response = await fetch(this.config.byProgram.latest.makeURL(programID));\n    if (!response.ok) return this.badResponseMessage(programID, this.config.byProgram.latest.makeURL(programID), response, programID);\n    const episode = (await response.json()).episode;\n    if (!episode) return this.badResponseMessage(programID, this.config.byProgram.latest.makeURL(programID), response, programID);\n    return this.formatAndFilterEpisodeData(episode);\n  }\n}\nmodule.exports = EpisodeFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-episodes.js?");

/***/ }),

/***/ "./scripts/api/fetch-programs.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-programs.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ProgramFetch {\n  constructor() {}\n  static config = {\n    all: {\n      suffix: \"programs/index\",\n      arguments: [\"isarchived=false\"],\n      makeURL: () => {\n        const query = [...this.config.all.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.all.suffix}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    },\n    byID: {\n      suffix: \"programs/\",\n      arguments: [\"isarchived=false\"],\n      makeURL: programID => {\n        if (!programID) return console.error(\"No programID provided.\");\n        const query = [...this.config.byID.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byID.suffix}${programID}`;\n        return `${path}?${query.join(\"&\")}`;\n      }\n    },\n    byChannel: {\n      suffix: \"programs/index\",\n      arguments: [\"isarchived=false\"],\n      makeURL: channelID => {\n        if (!channelID) return console.error(\"No channelID provided.\");\n        const query = [...this.config.byChannel.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;\n        return `${path}?channelid=${channelID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, id = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the programs.\n            ID: ${id}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static formatAndFilterProgramData(programData) {\n    return {\n      id: `program-${programData.id}`,\n      name: programData.name,\n      description: programData.description,\n      category: programData.programcategory,\n      payoff: programData.payoff,\n      broadcastinfo: programData.broadcastinfo,\n      image: programData.programimage,\n      episodes: []\n    };\n  }\n  static async All() {\n    const response = await fetch(this.config.all.makeURL());\n    if (!response.ok) return this.badResponseMessage(this.config.all.makeURL(), response);\n    const rawPrograms = (await response.json()).programs;\n    if (!rawPrograms) return this.badResponseMessage(this.config.all.makeURL(), response);\n    return rawPrograms.map(this.formatAndFilterProgramData);\n  }\n  static async SingleByID(programID) {\n    if (!programID) return console.error(\"No programID provided.\");\n    const response = await fetch(this.config.byID.makeURL(programID));\n    if (!response.ok) return this.badResponseMessage(this.config.byID.makeURL(programID), response, programID);\n    const rawProgram = (await response.json()).program;\n    if (!rawProgram) return this.badResponseMessage(this.config.byID.makeURL(programID), response, programID);\n    return this.formatAndFilterProgramData(rawProgram);\n  }\n  static async AllByChannel(channelID) {\n    if (!channelID) return console.error(\"No channelID provided.\");\n    const response = await fetch(this.config.byChannel.makeURL(channelID));\n    if (!response.ok) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    const rawPrograms = (await response.json()).programs;\n    if (!rawPrograms) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    return rawPrograms.map(this.formatAndFilterProgramData);\n  }\n}\nmodule.exports = ProgramFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-programs.js?");

/***/ }),

/***/ "./scripts/api/fetch-schedule.js":
/*!***************************************!*\
  !*** ./scripts/api/fetch-schedule.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst commonConfig = __webpack_require__(/*! ./common-config.json */ \"./scripts/api/common-config.json\");\nclass ScheduleFetch {\n  constructor() {}\n  static config = {\n    byChannel: {\n      suffix: \"scheduledepisodes\",\n      arguments: [],\n      makeURL: channelID => {\n        if (!channelID) return console.error(\"No channelID provided.\");\n        const query = [...this.config.byChannel.arguments, ...commonConfig.arguments];\n        const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;\n        return `${path}?channelid=${channelID}&${query.join(\"&\")}`;\n      }\n    }\n  };\n  static badResponseMessage(URL, response, id = \"N/A\") {\n    return console.warn(`\n            Didn't get a proper response from the Sveriges Radio API when fetching the schedule.\n            ID: ${id}\n            URL used: ${URL}\n            Response: ${response}\n            `.trim());\n  }\n  static async CurrentEpisodeByChannel(channelID) {\n    if (!channelID) return console.error(\"No channelID provided.\");\n    if (typeof channelID === \"string\") channelID = channelID.replace(/\\D/g, \"\"); // Sometimes channel-### is passed\n\n    const response = await fetch(this.config.byChannel.makeURL(channelID));\n    if (!response.ok) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    const schedule = (await response.json()).schedule;\n    if (!schedule) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);\n    const scheduledEpisodes = schedule.map(episode => ({\n      title: episode.title,\n      id: `episode-${episode.episodeid}`,\n      startTime: parseInt(episode.starttimeutc.replace(/\\D/g, \"\")),\n      endTime: parseInt(episode.endtimeutc.replace(/\\D/g, \"\"))\n    }));\n    const currentlyPlayingEpisode = scheduledEpisodes.find(episode => episode.startTime < Date.now() && episode.endTime > Date.now());\n    return currentlyPlayingEpisode;\n  }\n}\nmodule.exports = ScheduleFetch;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/api/fetch-schedule.js?");

/***/ }),

/***/ "./scripts/audio-player.js":
/*!*********************************!*\
  !*** ./scripts/audio-player.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const api = __webpack_require__(/*! ./api/api */ \"./scripts/api/api.js\");\nclass AudioPlayer {\n  track = new Audio();\n  preload = new Audio();\n  controlDOM = document.querySelector(\"#player\");\n  playIconPath = \"assets/icons/icons8-play-48.png\";\n  pauseIconPath = \"assets/icons/icons8-pause-48.png\";\n  progressOverride = false;\n  constructor() {\n    this.track.preload = \"auto\";\n    this.preload.preload = \"auto\";\n\n    // ControlDOM play button\n    const playButton = this.controlDOM.querySelector(\"button\");\n    playButton.addEventListener(\"click\", () => {\n      if (this.track.paused) {\n        this.unpause();\n      } else {\n        this.pause();\n      }\n    });\n\n    // Play by URL\n    window.startTrackURL = () => document.dispatchEvent(new Event(\"startTrackURL\"));\n    document.addEventListener(\"startTrackURL\", async event => {\n      const playButton = event?.target?.activeElement;\n      if (!playButton) return console.error(\"No play button found.\");\n      const url = playButton.dataset.playUrl;\n      if (playButton.dataset.progressOverride) {\n        this.progressOverride = true;\n      } else {\n        this.progressOverride = false;\n      }\n      this.startTrack(url);\n    });\n\n    // Progress update \n    this.track.addEventListener(\"timeupdate\", () => {\n      this.updateDOM();\n    });\n  }\n  pause() {\n    this.track.pause();\n    this.controlDOM.querySelector(\"button img\").src = this.playIconPath;\n  }\n  unpause() {\n    if (this.track.src === \"\") return;\n    this.track.play();\n    this.controlDOM.querySelector(\"button img\").src = this.pauseIconPath;\n  }\n  loadTrack(url) {\n    this.track.src = url;\n  }\n  startTrack(url) {\n    this.track.addEventListener(\"canplaythrough\", () => {\n      this.unpause();\n    }, {\n      once: true\n    });\n    this.loadTrack(url);\n  }\n  preloadTrack(url) {\n    this.preload.src = url;\n  }\n  setProgressBarDOM(fraction) {\n    const progressBar = this.controlDOM.querySelector(\".progress-bar .foreground\");\n    const margin = 2;\n    const width = margin + parseInt(fraction) * (100 - margin);\n    progressBar.style.width = `${width}%`;\n  }\n  setProgressTimeDOM(time) {\n    const timeDisplay = this.controlDOM.querySelector(\".time-display\");\n    timeDisplay.textContent = time;\n  }\n  updateDOM() {\n    const elapsedSeconds = this.track.currentTime;\n    const duration = this.track.duration;\n    if (this.progressOverride) {\n      this.setProgressTimeDOM(\"• Live\");\n      this.setProgressBarDOM(1);\n      return;\n    }\n    const minutes = `${Math.floor(elapsedSeconds / 60)}`.padStart(2, \"0\");\n    const seconds = `${Math.floor(elapsedSeconds % 60)}`.padStart(2, \"0\");\n    this.setProgressTimeDOM(`${minutes}:${seconds}`);\n    this.setProgressBarDOM(elapsedSeconds / duration);\n  }\n}\nmodule.exports = new AudioPlayer();\n\n//# sourceURL=webpack://vr-radio-player/./scripts/audio-player.js?");

/***/ }),

/***/ "./scripts/image-loader.js":
/*!*********************************!*\
  !*** ./scripts/image-loader.js ***!
  \*********************************/
/***/ ((module) => {

"use strict";
eval("\n\nclass ImageLoader {\n  constructor() {}\n  static async asyncLoad(target, imageURL, fallbackURL = null) {\n    if (!target || !imageURL) return console.warn(\"ImageLoader: asyncLoad() requires a target and imageURL. Received:\", target, imageURL);\n    const image = new Image();\n    image.addEventListener(\"error\", () => {\n      if (fallbackURL) {\n        target.src = fallbackURL;\n      }\n    });\n    image.addEventListener(\"load\", () => {\n      target.src = imageURL;\n    });\n    image.src = imageURL;\n  }\n}\nmodule.exports = ImageLoader;\n\n//# sourceURL=webpack://vr-radio-player/./scripts/image-loader.js?");

/***/ }),

/***/ "./scripts/main.js":
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst api = __webpack_require__(/*! ./api/api */ \"./scripts/api/api.js\");\nconst DOMMaker = __webpack_require__(/*! ./DOM-makers */ \"./scripts/DOM-makers.js\");\nconst AudioPlayer = __webpack_require__(/*! ./audio-player */ \"./scripts/audio-player.js\"); // Used by DOM button elements\n\n// \n// TEMP config\n// \nconst config = {\n  channels: {\n    followed: [218, 164, 132, 701]\n  },\n  programs: {\n    followed: [4923, 178, 2778]\n  }\n};\nconst main = async () => {\n  // \n  // New Episodes\n  // \n  // Hardcoded skeletons\n  const newEpisodesSkeletons = 3;\n  for (let index = 0; index < newEpisodesSkeletons; index++) {\n    const id = `skeleton-episode-${index}`;\n    const parent = document.querySelector(\".episodes ul\");\n    parent.appendChild(DOMMaker.skeleton(id));\n  }\n\n  // \n  // Followed programs\n  // \n  // Skeletons\n  config.programs.followed.forEach((programID, index) => {\n    const id = `program-${programID}`;\n    const parent = document.querySelector(\".programs ul\");\n    parent.appendChild(DOMMaker.skeleton(id));\n  });\n  // Data population\n  config.programs.followed.forEach(async (programID, index) => {\n    const program = await api.program.SingleByID(programID);\n    if (!program) return;\n    const latestEpisode = await api.episode.LatestByProgram(programID);\n    const DOMData = {\n      id: program.id,\n      image: program.image,\n      type: \"program\",\n      // Affects styling\n      header: {\n        title: program.name,\n        info: program.channelName\n      },\n      description: program.description,\n      footer: {\n        buttonFunction: `startTrackURL(this)`,\n        text: latestEpisode.name,\n        buttonData: {\n          playUrl: latestEpisode.url\n        }\n      }\n    };\n    DOMMaker.populateContentDOM(DOMData);\n  });\n\n  // \n  // Followed Channels\n  // \n  // Skeletons\n  config.channels.followed.forEach((channelID, index) => {\n    const id = `channel-${channelID}`;\n    const parent = document.querySelector(\".channels ul\");\n    parent.appendChild(DOMMaker.skeleton(id));\n  });\n  // Data population\n  config.channels.followed.forEach(async (channelID, index) => {\n    const channel = await api.channel.SingleByID(channelID);\n    if (!channel) return;\n    const DOMData = {\n      id: channel.id,\n      image: channel.image,\n      type: \"channel\",\n      // Affects styling\n      header: {\n        title: channel.name,\n        info: channel.channelType\n      },\n      description: channel.description,\n      footer: {\n        buttonFunction: `startTrackURL(this)`,\n        buttonData: {\n          playUrl: channel.url,\n          progressOverride: true\n        }\n      }\n    };\n    DOMMaker.populateContentDOM(DOMData);\n\n    // Show currently playing episode name\n    const footerText = document.querySelector(`#${DOMData.id} .footer>p`);\n    const currentlyPlayingEpisode = await api.schedule.CurrentEpisodeByChannel(channelID);\n    footerText.textContent = currentlyPlayingEpisode.title;\n  });\n};\nmain();\n\n//# sourceURL=webpack://vr-radio-player/./scripts/main.js?");

/***/ }),

/***/ "./scripts/api/common-config.json":
/*!****************************************!*\
  !*** ./scripts/api/common-config.json ***!
  \****************************************/
/***/ ((module) => {

"use strict";
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