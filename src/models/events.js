import {FilterType} from "../controllers/filter-controller";

export class Events {
  constructor() {
    this._events = [];
    this._filteredEvents = [];
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  get events() {
    return this._filteredEvents;
  }

  set events(events) {
    this._events = events;
    this._filteredEvents = events;
  }

  set filter(filterType) {
    switch (filterType) {
      case FilterType.FUTURE:
        this._filteredEvents = this._events.filter((event) => event.startDate > new Date());
        break;
      case FilterType.PAST:
        this._filteredEvents = this._events.filter((event) => event.startDate < new Date());
        break;
      default:
        this._filteredEvents = this._events;
        break;
    }
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
