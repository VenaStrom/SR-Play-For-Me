
class StorageManager {
    constructor() {
        this.storage = window.localStorage;
    }

    save(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    }
}