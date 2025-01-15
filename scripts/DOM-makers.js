"use strict";

class DOMMaker {
    constructor() { }

    static htmlFromString(htmlFormattedString) {
        const launderer = document.createElement("a");
        launderer.innerHTML = htmlFormattedString.trim();

        return launderer.firstChild;
    };

    static skeleton(id) {
        return this.htmlFromString(`
        <li class="content-dom" id="${id}">
            <img src="assets/images/image-missing.png" alt="Bild">

            <div class="body">
                <div class="header">
                    <p class="title"></p>
                    <p class="info"></p>
                </div>

                <p class="description"></p>

                <div class="footer">
                    <p></p>

                    <button>
                        <img src="assets/icons/icons8-play-48.png" alt="Spela">
                    </button>
                </div>
            </div>
        </li>
        `);
    }
}

module.exports = DOMMaker;