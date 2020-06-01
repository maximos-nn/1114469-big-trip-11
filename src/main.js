import API from "./api/api";
import Events from "./models/events";
import FilterController from "./controllers/filter-controller";
import InfoController from "./controllers/info-controller";
import Loading from "./components/loading";
import Menu, {MenuItem} from "./components/menu";
import Provider from "./api/provider";
import Statistics from "./components/statistics";
import Store from "./api/store";
import TripController from "./controllers/trip-controller";
import TripEvents from "./components/trip-events";
import {render, RenderPosition, remove} from "./utils/render";

const HIDDEN_CLASS = `visually-hidden`;
const AUTHORIZATION = `Basic akZySW7RrTUQXstbEgUh1`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const OFFLINE_TITLE = ` [offline]`;

const LocalStore = {
  PREFIX: `big-trip-local-storage`,
  VERSION: `v1`
};

const onError = (error) => {
  const node = document.createElement(`div`);
  node.style = `width: 180px; margin: 0 auto; text-align: center; background-color: red;`;

  node.textContent = error;
  document.body.insertAdjacentElement(`afterbegin`, node);
};

const eventsModel = new Events();
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(`${LocalStore.PREFIX}-${LocalStore.VERSION}`, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoController = new InfoController(tripMainElement, eventsModel);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const menuComponent = new Menu();
const filterController = new FilterController(tripControlsElement, eventsModel);
const addEventButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const bodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const tripEventsComponent = new TripEvents();
const loadingComponent = new Loading();
const tripController = new TripController(tripEventsComponent, eventsModel, apiWithProvider);
const statisticsComponent = new Statistics(eventsModel);

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

menuComponent.setActiveItem(MenuItem.TABLE);
tripInfoController.render();
render(tripControlsElement.querySelector(`h2`), menuComponent, RenderPosition.AFTEREND);
filterController.render();

render(bodyContainer, tripEventsComponent);
render(tripEventsComponent.getElement(), loadingComponent);
render(bodyContainer, statisticsComponent);
statisticsComponent.hide(HIDDEN_CLASS);

addEventButton.disabled = true;
addEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  addEventButton.disabled = true;
  filterController.reset();
  tripController.createEvent(() => {
    addEventButton.disabled = false;
  });
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(OFFLINE_TITLE, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += OFFLINE_TITLE;
});

apiWithProvider.getData()
  .finally(() => {
    remove(loadingComponent);
  })
  .then((data) => {
    const [destinations, eventTypes, events] = data;
    eventsModel.events = events;
    menuComponent.setMenuItemChangeHandler(menuItemChangeHandler);
    addEventButton.disabled = false;
    tripController.render(eventTypes, destinations);
  })
  .catch((error) => {
    onError(error);
  });
