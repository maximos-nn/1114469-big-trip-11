import {Day} from "../components/day";
import {DayList} from "../components/days-list";
import {EventController} from "./event-controller";
import {NoEvents} from "../components/no-events";
import {Sort, SortType} from "../components/sort";
import {render, remove} from "../utils/render";
import {getDate} from "../utils/common";

const mapEventToDate = (resultMap, event) => {
  const key = getDate(event.startDate.getTime());

  if (!resultMap.has(key)) {
    resultMap.set(key, []);
  }

  resultMap.get(key).push(event);
  return resultMap;
};

const groupByDays = (events) => events.reduce(mapEventToDate, new Map());

const renderEvents = (events, eventTypes, destinations, container, onDataChange, onViewChange) => {
  const controllers = [];
  let currentDay = 1;
  for (const [key, dayEvents] of events) { // [...eventsByDays.keys()].forEach((date, index) => {});

    // День. Содержит список точек. В режиме сортировки блок day__info должен быть пустым.
    const tripDayComponent = new Day(currentDay++, key && new Date(key));
    const tripDayElement = tripDayComponent.getElement();
    render(container, tripDayComponent);
    // Элемент списка точек в контейнере (дне).
    const tripEventListElement = tripDayElement.querySelector(`.trip-events__list`);

    // Точки маршрута.
    for (const event of dayEvents) {
      const eventController = new EventController(
          tripEventListElement,
          eventTypes,
          destinations,
          onDataChange,
          onViewChange
      );
      eventController.render(event);
      controllers.push(eventController);
    }
  }
  return controllers;
};

const sortEvents = (events, sortType) => {
  switch (sortType) {
    case SortType.TIME:
      return [[null, events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate))]];
    case SortType.PRICE:
      return [[null, events.slice().sort((a, b) => b.price - a.price)]];
    default:
      return groupByDays(events);
  }
};

export class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._eventTypes = [];
    this._noEventsComponent = new NoEvents();
    this._sortComponent = new Sort();
    this._dayListComponent = new DayList();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._eventControllers = [];
  }

  _renderDays(sortType) {
    // Список дней и контейнер для точек маршрута. Выводим только при наличии точек.
    // Должен содержать как минимум один элемент. В режиме сортировки используется только один элемент.
    render(this._container, this._dayListComponent);
    const sortedEvents = sortEvents(this._eventsModel.events, sortType);
    this._eventControllers = renderEvents(
        sortedEvents,
        this._eventTypes,
        this._destinations,
        this._dayListComponent.getElement(),
        this._onDataChange,
        this._onViewChange
    );
  }

  render(eventTypes, destinations) {
    this._eventTypes = eventTypes;
    this._destinations = destinations;

    // Основной контейнер для точек маршрута.
    const tripEventsElement = this._container;

    if (!this._eventsModel.events.length) {
      render(tripEventsElement, this._noEventsComponent);
      return;
    }

    // Форма сортировки, заголовки столбцов. Выводим только при наличии точек маршрута.
    render(tripEventsElement, this._sortComponent);

    // Форма создания/редактирования точки в режиме создания. Выводим в самом начале.
    // render(tripEventsElement, new EditForm(eventTypes));

    this._renderDays(this._sortComponent.getSortType());

    this._sortComponent.setSortTypeChangeHandler((newSortType) => {
      this._removeEvents();
      remove(this._dayListComponent);
      this._renderDays(newSortType);
    });
  }

  _removeEvents() {
    this._eventControllers.forEach((controller) => controller.cleanUp());
    this._eventControllers = [];
  }

  _onDataChange(eventController, oldData, newData) {
    this._eventsModel.updateEvent(oldData.id, newData);
    eventController.render(newData);
  }

  _onViewChange() {
    this._eventControllers.forEach((it) => it.setDefaultView());
  }
}
