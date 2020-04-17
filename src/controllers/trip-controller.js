import {Day} from "../components/day";
import {DayList} from "../components/days-list";
import {EditForm} from "../components/edit-form";
import {Event} from "../components/event";
import {NoEvents} from "../components/no-events";
import {Sort} from "../components/sorting";
import {render, replace} from "../utils/render";
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

const renderEvent = (eventListElement, event, eventTypes) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventComponent = new Event(event);
  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new EditForm(eventTypes, event);
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent);
};

export class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEvents();
    this._sortComponent = new Sort();
    this._dayListComponent = new DayList();
  }

  render(events, eventTypes) {
    // Основной контейнер для точек маршрута.
    const tripEventsElement = this._container;

    if (!events.length) {
      render(tripEventsElement, this._noEventsComponent);
      return;
    }

    // Форма сортировки, заголовки столбцов. Выводим только при наличии точек маршрута.
    render(tripEventsElement, this._sortComponent);

    // Форма создания/редактирования точки в режиме создания. Выводим в самом начале.
    // render(tripEventsElement, new EditForm(eventTypes).getElement());

    // Список дней и контейнер для точек маршрута. Выводим только при наличии точек.
    // Должен содержать как минимум один элемент. В режиме сортировки используется только один элемент.
    render(tripEventsElement, this._dayListComponent);

    const eventsByDays = groupByDays(events);
    let currentDay = 1;
    for (const [key, dayEvents] of eventsByDays) { // [...eventsByDays.keys()].forEach((date, index) => {});

      // День. Содержит список точек. В режиме сортировки блок day__info должен быть пустым.
      const tripDayComponent = new Day(currentDay++, new Date(key));
      const tripDayElement = tripDayComponent.getElement();
      render(this._dayListComponent.getElement(), tripDayComponent);
      // Элемент списка точек в контейнере (дне).
      const tripEventListElement = tripDayElement.querySelector(`.trip-events__list`);

      // Точки маршрута.
      for (const event of dayEvents) {
        renderEvent(tripEventListElement, event, eventTypes);
      }
    }
  }
}
