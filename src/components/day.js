import {formatISODate} from "../utils";

export const createDayTemplate = (counter, date) => {
  const dateValue = date.toDateString().split(` `).slice(1, 3).join(` `);
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
