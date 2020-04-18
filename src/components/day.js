import {AbstractComponent} from "./abstract-component";
import {formatISODate, formatMonthDayDate} from "../utils/format";

const createDayTemplate = (counter, date) => {
  let dayInfo = ``;
  if (date) {
    const dateValue = formatMonthDayDate(date);
    dayInfo = `<span class="day__counter">${counter}</span>
    <time class="day__date" datetime="${formatISODate(date)}">${dateValue}</time>`;
  }
  return (
    `<li class="trip-days__item  day">
    <div class="day__info">${dayInfo}</div>

    <ul class="trip-events__list">
    </ul>
  </li>`
  );
};

export class Day extends AbstractComponent {
  constructor(counter, date) {
    super();
    this._counter = counter;
    this._date = date;
  }

  getTemplate() {
    return createDayTemplate(this._counter, this._date);
  }
}
