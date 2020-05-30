import {filterEvents} from "../utils/filter";

export class Events {
  constructor() {
    this._events = [];
    this._currentFilterType = null;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  get events() {
    return filterEvents(this._events, this._currentFilterType);
  }

  set events(events) {
    this._events = events;
    this._callHandlers(this._dataChangeHandlers);
  }

  get length() {
    return this._events.length;
  }

  get allEvents() {
    return this._events;
  }

  set filter(filterType) {
    this._currentFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    if (typeof handler === `function`) {
      this._filterChangeHandlers.push(handler);
    }
  }

  setDataChangeHandler(handler) {
    if (typeof handler === `function`) {
      this._dataChangeHandlers.push(handler);
    }
  }

  updateEvent(id, newEvent) {
    const index = this._events.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._events = [].concat(this._events.slice(0, index), newEvent, this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  addEvent(newEvent) {
    this._events = [].concat(newEvent, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
