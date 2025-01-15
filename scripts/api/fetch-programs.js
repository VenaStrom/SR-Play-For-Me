"use strict";

const commonConfig = require("./common-config.json");

class ProgramFetch {
    constructor() { }

    config = {
        all: {
            suffix: "programs/index",
            arguments: ["isarchived=false",],
            makeURL: () => {
                const query = [...this.config.all.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.all.suffix}`;
                return `${path}?${query.join("&")}`;
            },
        },
        byID: {
            suffix: "programs/",
            arguments: ["isarchived=false",],
            makeURL: (programID) => {
                if (!programID) return console.error("No programID provided.");
                const query = [...this.config.byID.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.byID.suffix}${programID}`;
                return `${path}?${query.join("&")}`;
            },
        },
        byChannel: {
            suffix: "programs/index",
            arguments: ["isarchived=false",],
            makeURL: (channelID) => {
                if (!channelID) return console.error("No channelID provided.");
                const query = [...this.config.byChannel.arguments, ...commonConfig.arguments,];
                const path = `${commonConfig.baseURL}${this.config.byChannel.suffix}`;
                return `${path}?channelid=${channelID}&${query.join("&")}`;
            },
        }
    }

    badResponseMessage(URL, response, ID = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the programs.
            ID: ${ID}
            URL used: ${URL}
            Response: ${response}
            `.trim());
    }

    formatAndFilterProgramData(programData) {
        return {
            ID: programData.id,
            name: programData.name,
            description: programData.description,
            category: programData.programcategory,
            payoff: programData.payoff,
            broadcastinfo: programData.broadcastinfo,
            image: programData.programimage,
            episodes: [],
        };
    }

    async all() {
        const response = await fetch(this.config.all.makeURL());
        if (!response.ok) return this.badResponseMessage(this.config.all.makeURL(), response);

        const rawPrograms = (await response.json()).programs;
        if (!rawPrograms) return this.badResponseMessage(this.config.all.makeURL(), response);

        return rawPrograms.map(this.formatAndFilterProgramData);
    }

    async byID(programID) {
        if (!programID) return console.error("No programID provided.");

        const response = await fetch(this.config.byID.makeURL(programID));
        if (!response.ok) return this.badResponseMessage(this.config.byID.makeURL(programID), response, programID);

        const rawProgram = (await response.json()).program;
        if (!rawProgram) return this.badResponseMessage(this.config.byID.makeURL(programID), response, programID);

        return this.formatAndFilterProgramData(rawProgram);
    }

    async byChannel(channelID) {
        if (!channelID) return console.error("No channelID provided.");

        const response = await fetch(this.config.byChannel.makeURL(channelID));
        if (!response.ok) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);

        const rawPrograms = (await response.json()).programs;
        if (!rawPrograms) return this.badResponseMessage(this.config.byChannel.makeURL(channelID), response, channelID);

        return rawPrograms.map(this.formatAndFilterProgramData);
    }
}

module.exports = new ProgramFetch;