
const createContentDOM = (parent, data, type = null) => {
    if (!data) {
        data = {
            id: "",
            type: "content", // This is a fallback just so that it gets styled no matter what
            header: {
                title: "Laddar...",
                info: "",
            },
            description: "",
            footer: {
                text: "",
            },
        }
    }
    if (type) {
        data.type = type;
    }

    const defaultImage = "assets/images/image-missing.png";

    const idString = `${data.type}-${data.id}`;

    const template = `
    <li class="${data.type}-dom" id="${idString}">
        <img src="${defaultImage}" alt="Bild">

        <div class="body">
            <div class="header">
                <p class="title">${data.header.title || "Saknar titel"}</p>
                <p class="info">${data.header.info || ""}</p>
            </div>

            <p class="description">${data.description || ""}</p>

            <div class="footer">
                <p>${data.footer.text || ""}</p>

                <button data-id="${idString}">
                    <img src="assets/icons/icons8-play-48.png" alt="Spela">
                </button>
            </div>
        </div>
    </li>`;

    // Add to parent
    parent.insertAdjacentHTML("beforeend", template);

    //
    // Loading the image
    //
    // Reference to the newly added <img> element
    const imgElement = parent.lastElementChild.querySelector("img");

    // Preload the image
    const preloadedImage = new Image();
    preloadedImage.src = data.image || defaultImage;

    // On load, update the <img> element's src
    preloadedImage.onload = () => {
        imgElement.src = preloadedImage.src;
    };
};