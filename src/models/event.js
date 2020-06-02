export default class Event {
  constructor(event) {
    this.id = event[`id`];
    this.type = event[`type`];
    this.price = event[`base_price`];
    this.startDate = new Date(event[`date_from`]);
    this.endDate = new Date(event[`date_to`]);
    this.destination = event[`destination`][`name`];
    this.destinationInfo = {description: event[`destination`][`description`], photos: event[`destination`][`pictures`]};
    this.offers = event[`offers`];
    this.isFavorite = Boolean(event[`is_favorite`]);
  }

  toRaw() {
    return {
      [`id`]: this.id,
      [`type`]: this.type,
      [`base_price`]: this.price,
      [`date_from`]: this.startDate.toISOString(),
      [`date_to`]: this.endDate.toISOString(),
      [`destination`]: {
        [`name`]: this.destination,
        [`description`]: this.destinationInfo.description,
        [`pictures`]: this.destinationInfo.photos
      },
      [`offers`]: this.offers,
      [`is_favorite`]: this.isFavorite
    };
  }

  static parseEvent(event) {
    return new Event(event);
  }

  static parseEvents(events) {
    return events.map((event) => Event.parseEvent(event));
  }

  static clone(event) {
    return new Event(event.toRaw());
  }

  static create(event) {
    return new Event({
      [`id`]: event.id,
      [`type`]: event.type,
      [`base_price`]: event.price,
      [`date_from`]: event.startDate.toISOString(),
      [`date_to`]: event.endDate.toISOString(),
      [`destination`]: {
        [`name`]: event.destination,
        [`description`]: event.destinationInfo.description,
        [`pictures`]: event.destinationInfo.photos
      },
      [`offers`]: event.offers,
      [`is_favorite`]: event.isFavorite
    });
  }
}
