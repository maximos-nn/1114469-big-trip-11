import {AbstractComponent} from "./abstract-component";
import {formatISODate, formatMonthDayDate} from "../utils/format";

const createDayTemplate = (counter, date) => {
  const dateValue = formatMonthDayDate(date);
  return (
    `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${formatISODate(date)}">${dateValue}</time>
    </div>

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
