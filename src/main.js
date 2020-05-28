import {Events} from "./models/events";
import {FilterController} from "./controllers/filter-controller";
import {InfoController} from "./controllers/info-controller";
import {Menu, MenuItem} from "./components/menu";
import {Statistics} from "./components/statistics";
import {TripController} from "./controllers/trip-controller";
import {TripEvents} from "./components/trip-events";
import {generateEventTypes} from "./mocks/event-type";
import {generateDestinations} from "./mocks/destination";
import {generateEvents} from "./mocks/event";
import {render, RenderPosition} from "./utils/render";

const EVENTS_COUNT = 20;
const HIDDEN_CLASS = `visually-hidden`;

const eventTypes = generateEventTypes();
const destinations = generateDestinations();
const events = generateEvents(EVENTS_COUNT, eventTypes, destinations).sort((a, b) => a.startDate - b.startDate);
const eventsModel = new Events();
eventsModel.events = events;

// Загловок.
const tripMainElement = document.querySelector(`.trip-main`);
// Блок информации о маршруте: наименование, сроки и стоимость.
const tripInfoController = new InfoController(tripMainElement, eventsModel);
tripInfoController.render();
// Блок элементов управления: навигация и фильтры.
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const menuComponent = new Menu();
menuComponent.setActiveItem(MenuItem.TABLE);
render(tripControlsElement.querySelector(`h2`), menuComponent, RenderPosition.AFTEREND);
const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();

const bodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const tripEventsComponent = new TripEvents();
render(bodyContainer, tripEventsComponent);
const tripController = new TripController(tripEventsComponent, eventsModel);
tripController.render(eventTypes, destinations);
const statisticsComponent = new Statistics(eventsModel);
render(bodyContainer, statisticsComponent);
statisticsComponent.hide(HIDDEN_CLASS);

// Кнопка добавления события.
const addEventButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  addEventButton.disabled = true;
  filterController.reset();
  tripController.createEvent(() => {
    addEventButton.disabled = false;
  });
});

menuComponent.setMenuItemChangeHandler((menuItem) => {
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
});


// Основные операции с данными.
// 1. Сортировка по дате и времени начала.
// 2. Группировка по дате начала.
// 3. Сортировка по продолжительности.
// 4. Сортировка по базовой цене точки.
// 5. Суммирование итоговых цен точек (вместе с опциями).
// 6. Формирование наименования маршрута (3 пункта назначения или первый и последний пункты).
// 7. Продолжительность маршрута (самая ранняя дата и самая поздняя дата). Активация кнопок фильтра.
// 8. Группировка (и сортировка) по типу точек для статистики.
// 9. Интервалы точек не должны пересекаться. Проверка пересечения диапазонов. Пункт 1.
// 10. Добавление новой точки. Пункты 5-7, 9.
// 11. Удаление точки. Пункты 5-7.
// 12. Изменение точки. Пункты 5-7, 9.

// Статистика.
// 1. Общая сумма по типу точек.
// 2. Общее количество по типу точек.
// 3. Общее время по типу точек.
