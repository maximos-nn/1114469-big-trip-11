import {FilterType} from "../controllers/filter-controller";

export class Events {
  constructor() {
    this._events = [];
    this._currentFilterType = null;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
    this._availableFilters = {};
    this._updateAvailableFilters();
  }

  get events() {
    return this._filterEvents(this._currentFilterType);
  }

  set events(events) {
    this._events = events;
    this._updateAvailableFilters();
  }

  get length() {
    return this._events.length;
  }

  get allEvents() {
    return this._events;
  }

  _updateAvailableFilters() {
    const totalCount = this._events.length;
    if (!totalCount) {
      this._availableFilters = {[FilterType.FUTURE]: false, [FilterType.PAST]: false};
      return;
    }
    const futureCount = this._filterEvents(FilterType.FUTURE).length;
    if (futureCount === totalCount) {
      this._availableFilters = {[FilterType.FUTURE]: true, [FilterType.PAST]: false};
    } else if (!futureCount) {
      this._availableFilters = {[FilterType.FUTURE]: false, [FilterType.PAST]: true};
    } else {
      this._availableFilters = {[FilterType.FUTURE]: true, [FilterType.PAST]: true};
    }
  }

  getAvailableFilters() {
    return this._availableFilters;
  }

  _filterEvents(filterType) {
    switch (filterType) {
      case FilterType.FUTURE:
        return this._events.filter((event) => event.startDate > new Date());
      case FilterType.PAST:
        return this._events.filter((event) => event.startDate < new Date());
      default:
        return this._events;
    }
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
    this._updateAvailableFilters();
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));
    this._updateAvailableFilters();
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  addEvent(newEvent) {
    this._events = [].concat(newEvent, this._events);
    this._updateAvailableFilters();
    this._callHandlers(this._dataChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
