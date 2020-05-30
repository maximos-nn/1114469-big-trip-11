import {API} from "./api";
import {Events} from "./models/events";
import {FilterController} from "./controllers/filter-controller";
import {InfoController} from "./controllers/info-controller";
import {Loading} from "./components/loading";
import {Menu, MenuItem} from "./components/menu";
import {Statistics} from "./components/statistics";
import {TripController} from "./controllers/trip-controller";
import {TripEvents} from "./components/trip-events";
import {render, RenderPosition, remove} from "./utils/render";

const HIDDEN_CLASS = `visually-hidden`;
const AUTHORIZATION = `Basic akZySW7RrTUQXstbEgUh`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const eventsModel = new Events();
const api = new API(END_POINT, AUTHORIZATION);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoController = new InfoController(tripMainElement, eventsModel);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const menuComponent = new Menu();
menuComponent.setActiveItem(MenuItem.TABLE);
const filterController = new FilterController(tripControlsElement, eventsModel);

const bodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const tripEventsComponent = new TripEvents();
const loadingComponent = new Loading();
const tripController = new TripController(tripEventsComponent, eventsModel, api);
const statisticsComponent = new Statistics(eventsModel);

tripInfoController.render();
render(tripControlsElement.querySelector(`h2`), menuComponent, RenderPosition.AFTEREND);
filterController.render();

render(bodyContainer, tripEventsComponent);
render(tripEventsComponent.getElement(), loadingComponent);
render(bodyContainer, statisticsComponent);
statisticsComponent.hide(HIDDEN_CLASS);

const addEventButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addEventButton.disabled = true;
addEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  addEventButton.disabled = true;
  filterController.reset();
  tripController.createEvent(() => {
    addEventButton.disabled = false;
  });
});

const menuItemChangeHandler = (menuItem) => {
  menuComponent.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      tripController.show();
      statisticsComponent.hide(HIDDEN_CLASS);
      break;
    case MenuItem.STATISTICS:
      tripController.hide();
      statisticsComponent.show(HIDDEN_CLASS);
      break;
  }
};

api.getData()
  .then((data) => {
    const [destinations, eventTypes, events] = data;
    eventsModel.events = events;
    remove(loadingComponent);
    menuComponent.setMenuItemChangeHandler(menuItemChangeHandler);
    addEventButton.disabled = false;
    tripController.render(eventTypes, destinations);
  });
