import Day from "./components/day";
import DayList from "./components/days-list";
import EditForm from "./components/edit-form";
import Event from "./components/event";
import Filter from "./components/filter";
import Menu from "./components/menu";
import Sort from "./components/sorting";
import TripCost from "./components/trip-cost";
import TripInfo from "./components/trip-info";
import {generateEventTypes} from "./mocks/event-type";
import {generateDestinations} from "./mocks/destination";
import {generateEvents} from "./mocks/event";
import {generateMenu} from "./mocks/menu";
import {generateFilter} from "./mocks/filter";
import {getDate, render, RenderPosition} from "./utils";

const EVENTS_COUNT = 20;

const mapEventToDate = (resultMap, event) => {
  const key = getDate(event.startDate.getTime());

  if (!resultMap.has(key)) {
    resultMap.set(key, []);
  }

  resultMap.get(key).push(event);
  return resultMap;
};

const groupByDays = (events) => events.reduce(mapEventToDate, new Map());

const renderEvent = (eventListElement, event, eventTypes) => {
  const onEditButtonClick = () => {
    eventListElement.replaceChild(eventEditElement, eventElement);
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    eventListElement.replaceChild(eventElement, eventEditElement);
  };

  const eventElement = new Event(event).getElement();
  const editButton = eventElement.querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const eventEditElement = new EditForm(eventTypes, event).getElement();
  eventEditElement.addEventListener(`submit`, onEditFormSubmit);

  render(eventListElement, eventElement);
};

const eventTypes = generateEventTypes();
const destinations = generateDestinations();
const events = generateEvents(EVENTS_COUNT, eventTypes, destinations).sort((a, b) => a.startDate - b.startDate);
const eventsByDays = groupByDays(events);

// Загловок.
const tripMainElement = document.querySelector(`.trip-main`);
// Блок информации о маршруте: наименование, сроки и стоимость.
const tripInfoElement = new TripInfo(events).getElement();
render(tripMainElement, tripInfoElement, RenderPosition.AFTERBEGIN);
render(tripInfoElement, new TripCost(events).getElement());
// Блок элементов управления: навигация и фильтры.
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement.querySelector(`h2`), new Menu(generateMenu()).getElement(), RenderPosition.AFTEREND);
render(tripControlsElement, new Filter(generateFilter()).getElement());


// Основной контейнер для точек маршрута.
const tripEventsElement = document.querySelector(`.trip-events`);
// Форма сортировки, заголовки столбцов. Выводим только при наличии точек маршрута.
render(tripEventsElement, new Sort().getElement());

// Форма создания/редактирования точки в режиме создания. Выводим в самом начале.
// render(tripEventsElement, new EditForm(eventTypes).getElement());

// Список дней и контейнер для точек маршрута. Выводим только при наличии точек.
// Должен содержать как минимум один элемент. В режиме сортировки используется только один элемент.
const tripDaysListElement = new DayList().getElement();
render(tripEventsElement, tripDaysListElement);

let currentDay = 1;
for (const [key, dayEvents] of eventsByDays) { // [...eventsByDays.keys()].forEach((date, index) => {});

  // День. Содержит список точек. В режиме сортировки блок day__info должен быть пустым.
  const tripDayElement = new Day(currentDay++, new Date(key)).getElement();
  render(tripDaysListElement, tripDayElement);
  // Элемент списка точек в контейнере (дне).
  const tripEventListElement = tripDayElement.querySelector(`.trip-events__list`);

  // Точки маршрута.
  for (const event of dayEvents) {
    renderEvent(tripEventListElement, event, eventTypes);
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
