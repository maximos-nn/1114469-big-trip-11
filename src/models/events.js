import {FilterType} from "../controllers/filter-controller";

export class Events {
  constructor() {
    this._events = [];
    this._activeFilterType = null;
    this._filterChangeHandlers = [];
  }

  get events() {
    switch (this._activeFilterType) {
      case FilterType.FUTURE:
        return this._events.filter((event) => event.startDate > new Date());
      case FilterType.PAST:
        return this._events.filter((event) => event.startDate < new Date());
      default:
        return this._events;
    }
  }

  set events(events) {
    this._events = events;
  }

  set filter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    if (typeof handler === `function`) {
      this._filterChangeHandlers.push(handler);
    }
  }

  updateEvent(id, newEvent) {
    const index = this._events.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._events = [].concat(this._events.slice(0, index), newEvent, this._events.slice(index + 1));
    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
