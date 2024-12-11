let lastFetchedPrograms = new Date(0);

const getAllPrograms = async () => {
    const response = await fetch(api.programs.getURI());

    // Format and stuff and then return
};