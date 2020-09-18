import {nanoid} from 'nanoid';
import EventsModel from '../model/events.js';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.event);
};

const createStoreStructure = (items, type) => {
  switch (type) {
    case `events`:
      return items.reduce((acc, current) => {
        return Object.assign({}, acc, {
          [current.id]: current,
        });
      }, {});
    case `details`:
      return items.reduce((acc, current) => {
        return Object.assign({}, acc, {
          [current.name]: current,
        });
      }, {});
    case `offers`:
      return items.reduce((acc, current) => {
        return Object.assign({}, acc, {
          [current.type]: current,
        });
      }, {});
  }
  return ``;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (Provider.isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer), `events`);
          this._store.setItems(items, `events`);
          return events;
        });
    }

    const storedEvents = Object.values(this._store.getItems().events);
    return Promise.resolve(storedEvents.map(EventsModel.adaptToClient));
  }

  getDetails() {
    if (Provider.isOnline()) {
      return this._api.getDetails()
        .then((details) => {
          const items = createStoreStructure(details, `details`);
          this._store.setItems(items, `details`);
          return new Map(details.map((it) => [it.name, it]));
        });
    }

    const storedDetails = Object.values(this._store.getItems().details);

    return Promise.resolve(new Map(storedDetails.map((it) => [it.name, it])));
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers, `offers`);
          this._store.setItems(items, `offers`);
          return new Map(offers.map((it) => [it.type, it]));
        });
    }

    const storedOffers = Object.values(this._store.getItems().offers);

    return Promise.resolve(new Map(storedOffers.map((it) => [it.type, it])));
  }

  updateEvent(event) {
    if (Provider.isOnline()) {
      return this._api.updateEvent(event)
        .then((update) => {
          this._store.setItem(update.id, EventsModel.adaptToServer(update));
          return update;
        });
    }

    this._store.setItem(event.object.id, EventsModel.adaptToServer(Object.assign({}, event.object)));
    return Promise.resolve(event.object);
  }

  addEvent(event) {
    if (Provider.isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, event, {id: localNewEventId});

    this._store.setItem(localNewEvent.id, EventsModel.adaptToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(event) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.object.id));
    }

    this._store.removeItem(event.object.id);
    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storedEvents = Object.values(this._store.getItems().events);

      return this._api.sync(storedEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEvents, ...updatedEvents], `events`);
          this._store.setItems(items, `events`);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
