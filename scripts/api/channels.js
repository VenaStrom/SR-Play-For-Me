let lastFetchedChannels = new Date(0);

const getAllChannels = async () => {
    const response = await fetch(api.channels.getURI());

    // Format and stuff and then return
};