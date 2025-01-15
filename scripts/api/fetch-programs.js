"use strict";

const commonConfig = require("./common-config.json");

class ProgramFetch {
    constructor() { }

    static config = {
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

    static badResponseMessage(URL, response, ID = "N/A") {
        return console.warn(`
            Didn't get a proper response from the Sveriges Radio API when fetching the programs.
            ID: ${ID}
            URL used: ${URL}
            Response: ${response}
            `.trim());
    }

    static formatAndFilterProgramData(programData) {
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

    static async all() {
        const response = await fetch(ProgramFetch.config.all.makeURL());
        if (!response.ok) return ProgramFetch.badResponseMessage(ProgramFetch.config.all.makeURL(), response);

        const rawPrograms = (await response.json()).programs;
        if (!rawPrograms) return ProgramFetch.badResponseMessage(ProgramFetch.config.all.makeURL(), response);

        return rawPrograms.map(ProgramFetch.formatAndFilterProgramData);
    }

    static async byID(programID) {
        if (!programID) return console.error("No programID provided.");

        const response = await fetch(ProgramFetch.config.byID.makeURL(programID));
        if (!response.ok) return ProgramFetch.badResponseMessage(ProgramFetch.config.byID.makeURL(programID), response, programID);

        const rawProgram = (await response.json()).program;
        if (!rawProgram) return ProgramFetch.badResponseMessage(ProgramFetch.config.byID.makeURL(programID), response, programID);

        return ProgramFetch.formatAndFilterProgramData(rawProgram);
    }

    static async byChannel(channelID) {
        if (!channelID) return console.error("No channelID provided.");

        const response = await fetch(ProgramFetch.config.byChannel.makeURL(channelID));
        if (!response.ok) return ProgramFetch.badResponseMessage(ProgramFetch.config.byChannel.makeURL(channelID), response, channelID);

        const rawPrograms = (await response.json()).programs;
        if (!rawPrograms) return ProgramFetch.badResponseMessage(ProgramFetch.config.byChannel.makeURL(channelID), response, channelID);

        return rawPrograms.map(ProgramFetch.formatAndFilterProgramData);
    }
}

module.exports = ProgramFetch;