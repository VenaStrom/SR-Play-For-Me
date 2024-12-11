
class ContentStorageManager {
    constructor() {
        this.storage = window.localStorage;

        this.data = {};

        if (this.storage.getItem("contentState")) {
            this.loadState();
        } else {
            this.saveState();
        }

        this.data.ids = {
            channels: [218, 164, 132, 701], // Add the preferred channel IDs here, they will be shown first
        };
    }

    set(key, value) {
        this.data[key] = value;
        this.saveState();
    }

    get(key) {
        return this.data[key];
    }

    saveState() {
        const contentState = {
            data: this.data
        };
        this.storage.setItem("contentState", JSON.stringify(contentState));
    }

    loadState() {
        const contentState = JSON.parse(this.storage.getItem("contentState"));

        Object.keys(contentState).forEach(key => {
            this[key] = contentState[key];
        });
    }
}