"use strict";

class ImageLoader {
    constructor() { }

    static async asyncLoad(target, imageURL, fallbackURL = null) {
        if (!target || !imageURL) return console.warn("ImageLoader: asyncLoad() requires a target and imageURL. Received:", target, imageURL);

        const image = new Image();

        image.addEventListener("error", () => {
            if (fallbackURL) {
                target.src = fallbackURL;
            }
        });

        image.addEventListener("load", () => {
            target.src = imageURL;
        });

        image.src = imageURL;
    }
}

module.exports = ImageLoader;