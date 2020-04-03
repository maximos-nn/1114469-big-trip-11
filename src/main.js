import {createDayTemplate} from "./components/day";
import {createDaysListTemplate} from "./components/days-list";
import {createEditFormTemplate} from "./components/edit-form";
import {createEventTemplate} from "./components/event";
import {createFiltersTemplate} from "./components/filter";
import {createMenuTemplate} from "./components/menu";
import {createSortTemplate} from "./components/sorting";
import {createTripCostTemplate} from "./components/trip-cost";
import {createTripInfoTemplate} from "./components/trip-info";

const EVENTS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-main__trip-info`);

render(tripInfoElement, createTripCostTemplate());

const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);

render(tripControlsElement.querySelector(`h2`), createMenuTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createEditFormTemplate());
render(tripEventsElement, createDaysListTemplate());

const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);
render(tripDaysListElement, createDayTemplate());

const tripDayElement = tripDaysListElement.querySelector(`.trip-days__item`);
const tripEventListElement = tripDayElement.querySelector(`.trip-events__list`);
for (let index = 0; index < EVENTS_COUNT; index++) {
  render(tripEventListElement, createEventTemplate());
}
