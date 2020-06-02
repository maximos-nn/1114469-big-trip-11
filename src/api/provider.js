import Event from "../models/event";
import {nanoid} from "nanoid";

const StorageItemGroup = {
  DESTINATIONS: `destinations`,
  EVENTS: `events`,
  TYPES: `types`
};

const isOnline = () => window.navigator.onLine;

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success).map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {[current.id]: current});
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isDirty = false;
  }

  getData() {
    if (isOnline()) {
      return this._api.getData()
        .then((data) => {
          const [destinations, eventTypes, events] = data;
          const items = createStoreStructure(events.map((event) => event.toRaw()));
          this._store.setItems(destinations, StorageItemGroup.DESTINATIONS);
          this._store.setItems(eventTypes, StorageItemGroup.TYPES);
          this._store.setItems(items, StorageItemGroup.EVENTS);
          return data;
        });
    }
    const storedDestinations = Object.values(this._store.getItems(StorageItemGroup.DESTINATIONS));
    const storedTypes = Object.values(this._store.getItems(StorageItemGroup.TYPES));
    const storedEvents = Object.values(this._store.getItems(StorageItemGroup.EVENTS));
    return Promise.resolve([storedDestinations, storedTypes, Event.parseEvents(storedEvents)]);
  }

  createEvent(newEvent) {
    if (isOnline()) {
      return this._api.createEvent(newEvent)
        .then((event) => {
          this._store.setItem(event.id, event.toRaw(), StorageItemGroup.EVENTS);
          return event;
        });
    }
    this._isDirty = true;
    const localNewEventId = nanoid();
    const localNewEvent = Event.clone(Object.assign(newEvent, {id: localNewEventId}));
    this._store.setItem(localNewEvent.id, localNewEvent.toRaw(), StorageItemGroup.EVENTS);
    return Promise.resolve(localNewEvent);
  }

  updateEvent(id, newEvent) {
    if (isOnline()) {
      return this._api.updateEvent(id, newEvent)
        .then((event) => {
          this._store.setItem(event.id, event.toRaw(), StorageItemGroup.EVENTS);
          return event;
        });
    }
    this._isDirty = true;
    const localEvent = Event.clone(Object.assign(newEvent, {id}));
    this._store.setItem(id, localEvent.toRaw(), StorageItemGroup.EVENTS);
    return Promise.resolve(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItem(id, StorageItemGroup.EVENTS));
    }
    this._isDirty = true;
    this._store.removeItem(id, StorageItemGroup.EVENTS);
    return Promise.resolve();
  }

  isSyncNeeded() {
    return this._isDirty;
  }

  sync() {
    if (isOnline()) {
      const storedEvents = Object.values(this._store.getItems(StorageItemGroup.EVENTS));
      return this._api.sync(storedEvents)
        .then((response) => {
          const createdEvents = response.created;
          const updatedEvents = getSyncedEvents(response.updated);
          const newEvents = [...createdEvents, ...updatedEvents];
          const items = createStoreStructure(newEvents);
          this._store.setItems(items, StorageItemGroup.EVENTS);
          this._isDirty = false;
          return Event.parseEvents(newEvents);
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }
}

