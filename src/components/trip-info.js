import {AbstractComponent} from "./abstract-component";
import {formatMonthDayDate} from "../utils/format";

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

export class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
