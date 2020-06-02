import EditForm, {EmptyEvent} from "../components/edit-form";
import Event from "../components/event";
import EventModel from "../models/event";
import {render, replace, remove} from "../utils/render";
import {getEventTypeData} from "../utils/common";

const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class EventController {
  constructor(container, eventTypes, destinations, onDataChange, onViewChange) {
    this._container = container;
    this._eventTypes = eventTypes;
    this._destinations = destinations;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._mode = mode;

    const {preposition, offers: typeOffers} = getEventTypeData(this._eventTypes, event.type);
    const eventToRender = Object.assign({}, event, {preposition, isNew: event === EmptyEvent});
    if (event === EmptyEvent) {
      eventToRender.offers = typeOffers;
    } else {
      eventToRender.offers = typeOffers.map((offer) => Object.assign(
          {},
          offer,
          {isSelected: event.offers.findIndex((selected) => selected.title === offer.title) > -1}
      ));
    }
    this._eventComponent = new Event(eventToRender);
    this._eventEditComponent = new EditForm(this._eventTypes, eventToRender, this._destinations);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._eventEditComponent.setButtonCaptions({saveButton: `Saving...`});
      const formEvent = this._eventEditComponent.getData();
      this._eventEditComponent.disable();
      this._onDataChange(this, event, EventModel.create(formEvent));
    });

    this._eventEditComponent.setResetHandler((evt) => {
      evt.preventDefault();
      this._eventEditComponent.setButtonCaptions({deleteButton: `Deleting...`});
      this._eventEditComponent.disable();
      this._onDataChange(this, event, null);
    });

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;
      this._eventEditComponent.disable();
      this._onDataChange(this, event, newEvent, false);
    });

    this._eventEditComponent.setCloseButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    switch (this._mode) {
      case Mode.ADDING:
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent);
        break;

      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent);
        }
        break;

      case Mode.EDIT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          render(this._container, this._eventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        break;
    }

    if (oldEventComponent && oldEventEditComponent) {
      remove(oldEventComponent);
      remove(oldEventEditComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  clean() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this.setErrorStyle();

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;
      this._eventEditComponent.enable();
      this._eventEditComponent.setButtonCaptions({saveButton: `Save`, deleteButton: `Delete`});
      this.setErrorStyle();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setErrorStyle() {
    this._eventEditComponent.getElement().style.outline = `2px solid red`;
  }

  clearErrorStyle() {
    this._eventEditComponent.getElement().style.outline = ``;
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
        return;
      }
      this._replaceEditToEvent();
    }
  }
}

export {Mode};
