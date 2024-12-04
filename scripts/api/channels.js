let lastFetchedChannels = new Date(0);

const getAllChannels = async () => {


    const response = await fetch(api.channels.getURI());

    return (await response.json()).channels;
};