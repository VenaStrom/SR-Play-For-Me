
const getAllPrograms = async () => {
    const response = await fetch(api.programs.getURI());

    if (!response.ok) {
        console.warn("Didn't get a proper response from the Sveriges Radio API when fetching the programs. URL and response:", api.programs.getURI(), response,);
        return null;
    }

    const rawPrograms = (await response.json()).programs;

    if (!rawPrograms) {
        console.warn("Didn't get any programs from the Sveriges Radio API when fetching the programs. URL and response:", api.programs.getURI(), response,);
        return null;
    }

    const programs = rawPrograms.map((programData) => {
        return {
            id: programData.id,
            name: programData.name,
            description: programData.description,
            category: programData.programcategory,
            payoff: programData.payoff,
            broadcastinfo: programData.broadcastinfo,
            image: programData.programimage,
            episodes: [],
        };
    });

    return programs;
};