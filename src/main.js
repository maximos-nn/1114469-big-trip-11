import {Events} from "./models/events";
import {FilterController} from "./controllers/filter-controller";
import {Menu} from "./components/menu";
import {TripCost} from "./components/trip-cost";
import {TripController} from "./controllers/trip-controller";
import {TripInfo} from "./components/trip-info";
import {generateEventTypes} from "./mocks/event-type";
import {generateDestinations} from "./mocks/destination";
import {generateEvents} from "./mocks/event";
import {generateMenu} from "./mocks/menu";
import {render, RenderPosition} from "./utils/render";

const EVENTS_COUNT = 1;

const eventTypes = generateEventTypes();
const destinations = generateDestinations();
const events = generateEvents(EVENTS_COUNT, eventTypes, destinations).sort((a, b) => a.startDate - b.startDate);
const eventsModel = new Events();
eventsModel.events = events;

// Загловок.
const tripMainElement = document.querySelector(`.trip-main`);
// Блок информации о маршруте: наименование, сроки и стоимость.
const tripInfoComponent = new TripInfo(events); // Передавать модель и обновлять
const tripInfoElement = tripInfoComponent.getElement();
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoElement, new TripCost(events)); // Передавать модель и обновлять
// Блок элементов управления: навигация и фильтры.
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement.querySelector(`h2`), new Menu(generateMenu()), RenderPosition.AFTEREND);
const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, eventsModel);
tripController.render(eventTypes, destinations);

// Кнопка добавления события.
const addEventButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  addEventButton.disabled = true;
  tripController.createEvent(() => {
    addEventButton.disabled = false;
  });
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
