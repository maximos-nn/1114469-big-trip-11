import {AbstractSmartComponent} from "./abstract-smart-component";
import {capitalizeFirstLetter, formatDate, formatTime} from "../utils/format";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export const EmptyEvent = {
  type: `flight`,
  preposition: `to`,
  destination: ``,
  startDate: new Date(),
  endDate: new Date(),
  price: ``,
  offers: [],
  destinationInfo: {
    description: ``,
    photos: [],
  },
  isFavorite: false
};

const createEventTypeMarkup = (type, currentType) => {
  const checkedAttrib = type === currentType ? `checked` : ``;
  const title = capitalizeFirstLetter(type);
  return (
    `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedAttrib}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${title}</label>
  </div>`
  );
};

const createEventGroupMarkup = (group, currentType) => {
  const {group: title, types} = group;
  const typesMarkup = types.map((type) => createEventTypeMarkup(type, currentType)).join(`\n`);
  return (
    `<fieldset class="event__type-group">
    <legend class="visually-hidden">${title}</legend>

    ${typesMarkup}
  </fieldset>`
  );
};

const createPhotosMarkup = (photos) => {
  return (
    `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(`\n`)}
    </div>
  </div>`
  );
};

const createDestinationMarkup = (destinationInfo) => {
  if (!destinationInfo) {
    return ``;
  }
  const {description, photos} = destinationInfo;
  if (!description && !photos) {
    return ``;
  }
  const descriptionMarkup = description ? `<p class="event__destination-description">${description}</p>` : ``;
  const photosMarkup = photos.length ? createPhotosMarkup(photos) : ``;
  return (
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${descriptionMarkup}

    ${photosMarkup}
  </section>`
  );
};

const createOfferMarkup = (offer) => {
  const {title, name, price, isSelected} = offer;
  const checkedAttrib = isSelected ? `checked` : ``;
  return (
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${checkedAttrib}>
    <label class="event__offer-label" for="event-offer-${name}-1">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </label>
  </div>`
  );
};

const createOffersMarkup = (offers) => {
  if (!offers || !offers.length) {
    return ``;
  }
  const offersMarkup = offers.map((offer) => createOfferMarkup(offer)).join(`\n`);
  return (
    `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offersMarkup}
    </div>
  </section>`
  );
};

const createDetailsMarkup = (offers, destinationInfo) => {
  const offersMarkup = createOffersMarkup(offers);
  const destinationMarkup = createDestinationMarkup(destinationInfo);
  if (!offersMarkup && !destinationMarkup) {
    return ``;
  }
  return (
    `<section class="event__details">
    ${offersMarkup}

    ${destinationMarkup}
  </section>`
  );
};

const createEditModeControls = (isFavorite) => {
  const checkedAttrib = isFavorite ? `checked` : ``;
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${checkedAttrib}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const isInt = (strValue) => {
  return /^[0-9]+/.test(strValue);
};

const createEditFormTemplate = (eventTypes, event, price, typeOptions, currentDestination, destinations) => {
  event = event || EmptyEvent;
  const isEditMode = event !== EmptyEvent;
  const destinationOptions = Array.from(destinations.keys());
  const {startDate, endDate, isFavorite} = event;
  const {type, preposition, offers} = typeOptions;
  const {destination, destinationInfo} = currentDestination;

  const isSaveButtonDisabled = !destinations.has(destination) || !isInt(price);
  const destinationLabelText = type ? `${capitalizeFirstLetter(type)} ${preposition}` : ``;
  const eventTypeIcon = type ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">` : ``;
  const positionClass = isEditMode ? `` : `trip-events__item`;
  const resetButtonCaption = isEditMode ? `Delete` : `Cancel`;
  const editModeControls = isEditMode ? createEditModeControls(isFavorite) : ``;
  const detailsMarkup = createDetailsMarkup(offers, destinationInfo);
  const startDateValue = `${formatDate(startDate)} ${formatTime(startDate)}`;
  const endDateValue = `${formatDate(endDate)} ${formatTime(endDate)}`;

  return (
    `<form class="${positionClass}  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          ${eventTypeIcon}
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          ${eventTypes.map((group) => createEventGroupMarkup(group, type)).join(`\n`)}
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${destinationLabelText}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationOptions.map((option) => `<option value="${option}"></option>`).join(`\n`)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateValue}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateValue}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" step="1" pattern="\d+" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaveButtonDisabled ? `disabled` : ``}>Save</button>
      <button class="event__reset-btn" type="reset">${resetButtonCaption}</button>

      ${editModeControls}
    </header>
    ${detailsMarkup}
  </form>`
  );
};

export class EditForm extends AbstractSmartComponent {
  constructor(eventTypes, event, destinations) {
    super();
    this._eventTypes = eventTypes;
    this._event = event || EmptyEvent;
    this._isEditMode = this._event !== EmptyEvent;
    this._type = this._event.type;
    this._destination = this._event.destination;
    this._offers = this._event.offers;
    this._price = this._event.price;
    this._destinationInfoMap = new Map(destinations.map((it) => [it.destination, it.destinationInfo]));
    this._submitHandler = null;
    this._resetHandler = null;
    this._favoriteButtonClickHandler = null;
    this._closeButtonClickHandler = null;
    this._startFlatpickr = null;
    this._endFlatpickr = null;
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEditFormTemplate(
        this._eventTypes,
        this._event,
        this._price,
        Object.assign({}, this._getEventTypeData(this._eventTypes, this._type), {offers: this._offers}),
        {
          destination: this._destination,
          destinationInfo: this._destinationInfoMap.get(this._destination)
        },
        this._destinationInfoMap
    );
  }

  setSubmitHandler(handler) {
    this._submitHandler = handler;
  }

  setResetHandler(handler) {
    this._resetHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this._favoriteButtonClickHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    this._closeButtonClickHandler = handler;
  }

  reset() {
    this._type = this._event.type;
    this._offers = this._event.offers;
    this._destination = this._event.destination;
    this._price = this._event.price;
    this.rerender();
  }

  removeElement() {
    if (this._startFlatpickr && this._endFlatpickr) {
      this._startFlatpickr.destroy();
      this._endFlatpickr.destroy();
      this._startFlatpickr = null;
      this._endFlatpickr = null;
    }

    super.removeElement();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  _applyFlatpickr() {
    if (this._startFlatpickr && this._endFlatpickr) {
      this._startFlatpickr.destroy();
      this._endFlatpickr.destroy();
      this._startFlatpickr = null;
      this._endFlatpickr = null;
    }

    const options = {
      altInput: true,
      allowInput: true,
      enableTime: true,
      [`time_24hr`]: true,
      altFormat: `d/m/Y H:i`
    };
    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    this._startFlatpickr = flatpickr(startDateElement, Object.assign({}, options, {defaultDate: this._event && this._event.startDate || `today`}));
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._endFlatpickr = flatpickr(endDateElement, Object.assign({}, options, {defaultDate: this._event && this._event.endDate || `today`}));
  }

  _setUIHandlers() {
    const element = this.getElement();

    Array.from(element.querySelectorAll(`input[name="event-type"]`)).forEach((input) => {
      input.addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this._offers = this._getEventTypeData(this._eventTypes, this._type).offers || [];
        this.rerender();
      });
    });

    element.querySelector(`#event-destination-1`).addEventListener(`change`, (evt) => {
      this.getElement().querySelector(`.event__save-btn`).disabled = true;
      if (this._destinationInfoMap.has(evt.target.value)) {
        this._destination = evt.target.value;
        this.rerender();
      }
    });

    element.querySelector(`#event-price-1`).addEventListener(`change`, (evt) => {
      this.getElement().querySelector(`.event__save-btn`).disabled = true;
      if (isInt(evt.target.value)) {
        this._price = evt.target.value;
        this.rerender();
      }
    });

    element.addEventListener(`submit`, (evt) => {
      if (this._submitHandler) {
        this._submitHandler(evt);
      }
    });

    element.addEventListener(`reset`, (evt) => {
      if (this._resetHandler) {
        this._resetHandler(evt);
      }
    });

    if (this._isEditMode) {
      element.querySelector(`#event-favorite-1`).addEventListener(`click`, (evt) => {
        if (this._favoriteButtonClickHandler) {
          this._favoriteButtonClickHandler(evt);
        }
      });

      element.querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
        if (this._closeButtonClickHandler) {
          this._closeButtonClickHandler(evt);
        }
      });
    }
  }

  _getEventTypeData(eventTypes, currentType) {
    for (const group of eventTypes) {
      const {types, preposition, offers} = group;
      const index = types.findIndex((type) => type === currentType);
      if (index === -1) {
        continue;
      }
      return {type: currentType, preposition, offers: offers[currentType]};
    }
    return {};
  }

  _parseFormData(formData) {
    const destination = formData.get(`event-destination`);
    const type = formData.get(`event-type`);
    const {preposition, offers} = this._getEventTypeData(this._eventTypes, type);
    const newOffers = (offers || []).map((offer) => Object.assign({}, offer, {isSelected: !!formData.get(`event-offer-${offer.name}`)}));
    return {
      type,
      preposition: preposition || ``,
      destination,
      startDate: new Date(formData.get(`event-start-time`)),
      endDate: new Date(formData.get(`event-end-time`)),
      price: parseInt(formData.get(`event-price`), 10),
      offers: newOffers,
      destinationInfo: this._destinationInfoMap.get(destination),
      isFavorite: formData.has(`event-favorite`) ? !!formData.get(`event-favorite`) : false
    };
  }

  getData() {
    const formData = new FormData(this.getElement());
    return this._parseFormData(formData);
  }
}
