"use strict";

const ImageLoader = require("../image-loader");

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
    if (type) data.type = type;

    const defaultImagePath = "assets/images/image-missing.png";

    const template = `
    <li class="${data.type}-dom" id="${data.id}">
        <img src="${defaultImagePath}" alt="Bild">

        <div class="body">
            <div class="header">
                <p class="title">${data.header.title || "Saknar titel"}</p>
                <p class="info">${data.header.info || ""}</p>
            </div>

            <p class="description">${data.description || ""}</p>

            <div class="footer">
                <p>${data.footer.text || ""}</p>

                <button data-id="${data.id}">
                    <img src="assets/icons/icons8-play-48.png" alt="Spela">
                </button>
            </div>
        </div>
    </li>`;

    // Add to parent
    parent.insertAdjacentHTML("beforeend", template);

    // Async image loading
    const imgElement = parent.querySelector(`#${data.id} img`);
    ImageLoader.asyncLoad(imgElement, data.image || defaultImagePath, defaultImagePath);
};

module.exports = createContentDOM;