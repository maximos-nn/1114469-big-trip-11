import {formatMonthDayDate, createElement} from "../utils";

const getTripTitle = (events) => {
  const len = events && events.length;
  if (!len) {
    return ``;
  }
  if (len <= 3) {
    return events.map((event) => event.destination).join(`&nbsp;&mdash;&nbsp;`);
  }
  return `${events[0].destination}&nbsp;&mdash;&nbsp;&hellip;&nbsp;&mdash;&nbsp;${events[len - 1].destination}`;
};

const getTripPeriod = (events) => {
  const len = events && events.length;
  if (!len) {
    return ``;
  }
  return `${formatMonthDayDate(events[0].startDate)}&nbsp;&mdash;&nbsp;${formatMonthDayDate(events[len - 1].endDate)}`;
};

const createInfoMarkup = (title, period) => {
  return (
    `<div class="trip-info__main">
    <h1 class="trip-info__title">${title}</h1>
    <p class="trip-info__dates">${period}</p>
  </div>`
  );
};

const createTripInfoTemplate = (events) => {
  const title = getTripTitle(events);
  const period = getTripPeriod(events);
  const infoMarkup = title && period ? createInfoMarkup(title, period) : ``;
  return (
    `<section class="trip-main__trip-info  trip-info">
    ${infoMarkup}
  </section>`
  );
};

export default class TripInfo {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
