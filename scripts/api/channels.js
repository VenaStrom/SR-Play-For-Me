
const getAllChannels = async () => {
    const response = await fetch(api.allChannels.getURI());

    return await response.json();
};