export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, key) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: items
            })
        )
    );
  }

  setItem(key, value) {
    const details = this.getItems().details;
    const offers = this.getItems().offers;
    const events = Object.assign({}, this.getItems().events, {[key]: value});

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({details, offers, events})
        )
    );
  }

  removeItem(key) {
    const details = this.getItems().details;
    const offers = this.getItems().offers;
    const events = this.getItems().events;

    delete events[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(Object.assign({details, offers, events}))
    );
  }
}
