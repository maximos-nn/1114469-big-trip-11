export class Events {
  constructor() {
    this._events = [];
  }

  get events() {
    return this._events;
  }

  set events(events) {
    this._events = events;
  }

  updateEvent(id, newEvent) {
    const index = this._events.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._events = [].concat(this._events.slice(0, index), newEvent, this._events.slice(index + 1));
    return true;
  }
}
