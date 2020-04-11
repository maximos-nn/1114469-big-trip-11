import {formatISODate} from "../utils";

export const createDayTemplate = (counter, date) => {
  return (
    `            <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${formatISODate(date)}">${date.toDateString()}</time>
    </div>

    <ul class="trip-events__list">
    </ul>
  </li>
`
  );
};
