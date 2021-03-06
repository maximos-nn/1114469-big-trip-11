import Day from "../components/day";
import DayList from "../components/days-list";
import EventController, {Mode as EventControllerMode} from "./event-controller";
import {EmptyEvent} from "../components/edit-form";
import NoEvents from "../components/no-events";
import Sort, {SortType} from "../components/sort";
import {render, remove} from "../utils/render";
import {getDate} from "../utils/common";
import {FilterType} from "../utils/filter";

const HIDDEN_CLASS = `trip-events--hidden`;

const mapEventToDate = (result, event) => {
  const key = getDate(event.startDate.getTime());

  if (!result.has(key)) {
    result.set(key, []);
  }

  result.get(key).push(event);
  return result;
};

const groupByDays = (events) => events.reduce(mapEventToDate, new Map());

const renderEvents = (events, eventTypes, destinations, container, onDataChange, onViewChange) => {
  const controllers = [];
  let currentDay = 1;
  for (const [key, dayEvents] of events) {

    const tripDayComponent = new Day(currentDay++, key && new Date(key));
    const tripDayElement = tripDayComponent.getElement();
    render(container, tripDayComponent);
    const tripEventListElement = tripDayElement.querySelector(`.trip-events__list`);

    for (const event of dayEvents) {
      const eventController = new EventController(
          tripEventListElement,
          eventTypes,
          destinations,
          onDataChange,
          onViewChange
      );
      eventController.render(event, EventControllerMode.DEFAULT);
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
      return groupByDays(events.slice().sort((a, b) => a.startDate - b.startDate));
  }
};

export default class TripController {
  constructor(container, eventsModel, api) {
    this._containerComponent = container;
    this._container = container.getElement();
    this._eventsModel = eventsModel;
    this._api = api;
    this._eventTypes = [];
    this._noEventsComponent = new NoEvents();
    this._sortComponent = new Sort();
    this._dayListComponent = new DayList();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._eventControllers = [];
    this._newEvent = null;
    this._onNewEventHandled = null;

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render(eventTypes, destinations) {
    this._eventTypes = eventTypes;
    this._destinations = destinations;

    this._renderContainer();
  }

  createEvent(onNewEventHandledCb) {
    if (this._newEvent) {
      return;
    }
    this._onNewEventHandled = onNewEventHandledCb;
    this._newEvent = new EventController(
        this._container,
        this._eventTypes,
        this._destinations,
        this._onDataChange,
        this._onViewChange
    );
    this._eventsModel.filter = FilterType.EVERYTHING;
  }

  show() {
    this._containerComponent.show(HIDDEN_CLASS);
    this._updateContainer();
  }

  hide() {
    this._containerComponent.hide(HIDDEN_CLASS);
  }

  update() {
    this._updateEvents(this._sortComponent.getSortType());
  }

  _renderDays(sortType) {
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

  _renderContainer() {
    if (!(this._eventsModel.length || this._newEvent)) {
      render(this._container, this._noEventsComponent);
      return;
    }

    if (!this._eventsModel.length) {
      remove(this._noEventsComponent);
      this._newEvent.render(EmptyEvent, EventControllerMode.ADDING);
      return;
    }

    render(this._container, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler((newSortType) => {
      this._updateEvents(newSortType);
    });

    if (this._newEvent) {
      this._newEvent.render(EmptyEvent, EventControllerMode.ADDING);
    }

    this._renderDays(this._sortComponent.getSortType());
  }

  _updateContainer() {
    remove(this._sortComponent);
    this._sortComponent = new Sort();
    this._removeEvents();
    this._renderContainer();
  }

  _removeEvents() {
    this._eventControllers.forEach((controller) => controller.clean());
    this._eventControllers = [];
    remove(this._dayListComponent);
  }

  _updateEvents(sortType) {
    this._removeEvents();
    this._renderDays(sortType);
  }

  _cleanNewEvent() {
    this._newEvent.clean();
    this._newEvent = null;
    this._onNewEventHandled();
  }

  _onDataChange(eventController, oldData, newData, shouldRender = true) {
    eventController.clearErrorStyle();
    if (oldData === EmptyEvent) {
      if (newData === null) {
        this._cleanNewEvent();
      } else {
        this._api.createEvent(newData)
          .then((event) => {
            this._eventsModel.addEvent(event);
            this._cleanNewEvent();
            this._updateContainer();
          })
          .catch(() => {
            eventController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          if (this._eventsModel.events.length) {
            this._updateEvents(this._sortComponent.getSortType());
          } else {
            this._updateContainer();
          }
        })
        .catch(() => {
          eventController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((event) => {
          this._eventsModel.updateEvent(oldData.id, event);
          if (shouldRender) {
            this._updateEvents(this._sortComponent.getSortType());
          } else {
            eventController.render(event, EventControllerMode.EDIT);
          }
        })
        .catch(() => {
          eventController.shake();
        });
    }
  }

  _onViewChange() {
    if (this._newEvent) {
      this._cleanNewEvent();
    }
    this._eventControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateContainer();
  }
}
