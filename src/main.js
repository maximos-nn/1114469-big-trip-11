import {createDayTemplate} from "./components/day";
import {createDaysListTemplate} from "./components/days-list";
import {createEditFormTemplate} from "./components/edit-form";
import {createEventTemplate} from "./components/event";
import {createFiltersTemplate} from "./components/filter";
import {createMenuTemplate} from "./components/menu";
import {createSortTemplate} from "./components/sorting";
import {createTripCostTemplate} from "./components/trip-cost";
import {createTripInfoTemplate} from "./components/trip-info";
import {generateEventTypes} from "./mocks/event-type";
import {generateEvents} from "./mocks/event";
import {getDate} from "./utils";

const EVENTS_COUNT = 20;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const mapEventToDate = (resultMap, event) => {
  const key = getDate(event.startDate.getTime());

  if (!resultMap.has(key)) {
    resultMap.set(key, []);
  }

  resultMap.get(key).push(event);
  return resultMap;
};

const groupByDays = (events) => events.reduce(mapEventToDate, new Map());

const cost = 1230;
const eventTypes = generateEventTypes();
const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.startDate - b.startDate);
const eventsByDays = groupByDays(events);

// Загловок.
const tripMainElement = document.querySelector(`.trip-main`);
// Блок информации о маршруте: наименование, сроки и стоимость.
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);
const tripInfoElement = tripMainElement.querySelector(`.trip-main__trip-info`);
render(tripInfoElement, createTripCostTemplate(cost));
// Блок элементов управления: навигация и фильтры.
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement.querySelector(`h2`), createMenuTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate());


// Основной контейнер для точек маршрута.
const tripEventsElement = document.querySelector(`.trip-events`);
// Форма сортировки, заголовки столбцов. Выводим только при наличии точек маршрута.
render(tripEventsElement, createSortTemplate());

// Форма создания/редактирования точки в режиме создания. Выводим в самом начале.
// render(tripEventsElement, createEditFormTemplate(eventTypes));

// Список дней и контейнер для точек маршрута. Выводим только при наличии точек.
// Должен содержать как минимум один элемент. В режиме сортировки используется только один элемент.
render(tripEventsElement, createDaysListTemplate());
const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);

let currentDay = 1;
for (const [key, dayEvents] of eventsByDays) { // [...eventsByDays.keys()].forEach((date, index) => {});

  // День. Содержит список точек. В режиме сортировки блок day__info должен быть пустым.
  render(tripDaysListElement, createDayTemplate(currentDay++, new Date(key)));
  const tripDayElement = tripDaysListElement.querySelector(`.trip-days__item:last-child`);
  // Элемент списка точек в контейнере (дне).
  const tripEventListElement = tripDayElement.querySelector(`.trip-events__list`);

  // Точки маршрута.
  for (const event of dayEvents) {
    render(
        tripEventListElement,
        event === events[0] ? createEditFormTemplate(eventTypes, event) : createEventTemplate(event)
    );
  }

}


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
