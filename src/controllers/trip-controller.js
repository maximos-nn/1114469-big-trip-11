import {Day} from "../components/day";
import {DayList} from "../components/days-list";
import {EditForm} from "../components/edit-form";
import {Event} from "../components/event";
import {NoEvents} from "../components/no-events";
import {Sort, SortType} from "../components/sort";
import {render, replace, remove} from "../utils/render";
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

const renderEvents = (events, eventTypes, container) => {
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

      render(tripEventListElement, eventComponent);

    }
  }
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
    // render(tripEventsElement, new EditForm(eventTypes));

    const renderDays = (sortType) => {
      // Список дней и контейнер для точек маршрута. Выводим только при наличии точек.
      // Должен содержать как минимум один элемент. В режиме сортировки используется только один элемент.
      render(tripEventsElement, this._dayListComponent);
      const sortedEvents = sortEvents(events, sortType);
      renderEvents(sortedEvents, eventTypes, this._dayListComponent.getElement());
    };

    renderDays(this._sortComponent.getSortType());

    this._sortComponent.setSortTypeChangeHandler((newSortType) => {
      remove(this._dayListComponent);
      renderDays(newSortType);
    });
  }
}
