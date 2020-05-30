import {getEventTypeData} from "../utils/common";

export class Event {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.preposition = data[`preposition`];
    this.price = data[`base_price`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.destination = data[`destination`][`name`];
    this.destinationInfo = {description: data[`destination`][`description`], photos: data[`destination`][`pictures`]};
    this.offers = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
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

  static parseEvent(data, eventTypes) {
    const {preposition, offers} = getEventTypeData(eventTypes, data[`type`]);
    data[`offers`] = offers.map((offer) => Object.assign({}, offer, {isSelected: data[`offers`].findIndex((selected) => selected.title === offer.title) > -1}));
    return new Event(Object.assign(data, {preposition}));
  }

  static parseEvents(data, eventTypes) {
    return data.map((event) => Event.parseEvent(event, eventTypes));
  }

  static clone(data) {
    return new Event(data.toRaw());
  }

  static create(data) {
    return new Event({
      [`id`]: data.id,
      [`type`]: data.type,
      [`preposition`]: data.preposition,
      [`base_price`]: data.price,
      [`date_from`]: data.startDate.toISOString(),
      [`date_to`]: data.endDate.toISOString(),
      [`destination`]: {
        [`name`]: data.destination,
        [`description`]: data.destinationInfo.description,
        [`pictures`]: data.destinationInfo.photos
      },
      [`offers`]: data.offers,
      [`is_favorite`]: data.isFavorite
    });
  }
}
