import {formatISODate, formatMonthDayDate} from "../utils";

export const createDayTemplate = (counter, date) => {
  const dateValue = formatMonthDayDate(date);
  return (
    `            <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${formatISODate(date)}">${dateValue}</time>
    </div>

    <ul class="trip-events__list">
    </ul>
  </li>
`
  );
};
