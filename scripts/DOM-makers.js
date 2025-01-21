"use strict";

const api = require("./api/api");
const ImageLoader = require("./image-loader");

class DOMMaker {
    constructor() { }

    static htmlFromString(htmlFormattedString) {
        const launderer = document.createElement("a");
        launderer.innerHTML = htmlFormattedString.trim();

        return launderer.firstChild;
    };

    static async populateContentDOM(data) {
        if (!data) return console.error("No data to populate DOM with. ID:", data.id);

        const defaultImagePath = "assets/images/image-missing.png";

        const replacementDOM = this.htmlFromString(`
        <li class="${data.type || "content"}-dom" id="${data.id}">
            <img src="${defaultImagePath}" alt="Bild">

            <div class="body">
                <div class="header">
                    <p class="title">${data.header.title || "Saknar titel"}</p>
                    <p class="info">${data.header.info || ""}</p>
                </div>

                <p class="description">${data.description || ""}</p>

                <div class="footer">
                    <p class="time">${data?.footer?.time || ""}</p>
                    <p class="text">${data?.footer?.text || ""}</p>

                    <button class="play-button" onclick="${data?.footer?.buttonFunction || ""}">
                        <img src="assets/icons/icons8-play-48.png" alt="Spela">
                    </button>
                </div>
            </div>
        </li>`);

        // Dataset on button
        if (data?.footer?.buttonData) {
            const button = replacementDOM.querySelector("button");

            Object.entries(data.footer.buttonData).forEach(([key, value]) => {
                button.dataset[key] = value;
            });
        }

        const targetDOM = document.querySelector(`#${data.id}`);

        targetDOM.replaceWith(replacementDOM);

        // Async image loading
        const imgDOM = replacementDOM.querySelector(`#${data.id} img`);
        ImageLoader.asyncLoad(imgDOM, data.image || defaultImagePath, defaultImagePath);
    }

    static skeleton(id) {
        return this.htmlFromString(`
        <li class="content-dom" id="${id}">
            <img src="assets/images/image-missing.png" alt="Bild">

            <div class="body">
                <div class="header">
                    <p class="title"></p>
                    <p class="info"></p>
                </div>
            </div>
        </li>`);
    }
}

module.exports = DOMMaker;