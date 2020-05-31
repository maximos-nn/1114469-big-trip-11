export default class Store {
  static setDestinations(destinations) {
    Store.destinations = destinations;
  }

  static setEventTypes(eventTypes) {
    Store.eventTypes = eventTypes;
  }
}
