import {capitalizeFirstLetter, formatDate, formatTime} from "../utils";
import {generateDefaultEvent} from "../mocks/event";

const createEventTypeMarkup = (type, currentType) => {
  const checkedAttrib = type === currentType ? `checked` : ``;
  const title = capitalizeFirstLetter(type);
  return (
    `    <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedAttrib}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${title}</label>
  </div>
`
  );
};

const createEventGroupMarkup = (group, currentType) => {
  const {group: title, types} = group;
  const typesMarkup = types.map((type) => createEventTypeMarkup(type, currentType)).join(`\n`);
  return (
    `    <fieldset class="event__type-group">
    <legend class="visually-hidden">${title}</legend>

    ${typesMarkup}
  </fieldset>
`
  );
};

const createEventTypeListMarkup = (eventTypes, currentType) => {
  const eventGroupsMarkup = eventTypes.map((group) => createEventGroupMarkup(group, currentType)).join(`\n`);
  return (
    `        <div class="event__type-list">
    ${eventGroupsMarkup}
  </div>
`
  );
};

const createPhotoMarkup = (src) => {
  return (
    `        <img class="event__photo" src="${src}" alt="Event photo">
    `
  );
};

const createPhotosMarkup = (photos) => {
  const photosMarkup = photos.map((photo) => createPhotoMarkup(photo)).join(`\n`);
  return (
    `    <div class="event__photos-container">
    <div class="event__photos-tape">
    ${photosMarkup}
    </div>
  </div>
`
  );
};

const createDestinationMarkup = (destinationInfo) => {
  const {description, photos} = destinationInfo;
  if (!description && !photos) {
    return ``;
  }
  const descriptionMarkup = description ? `<p class="event__destination-description">${description}</p>` : ``;
  const photosMarkup = photos.length ? createPhotosMarkup(photos) : ``;
  return (
    `      <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${descriptionMarkup}

    ${photosMarkup}
  </section>
`
  );
};

const createOfferMarkup = (offer) => {
  const {title, name, price, isSelected} = offer;
  const checkedAttrib = isSelected ? `checked` : ``;
  return (
    `      <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${checkedAttrib}>
    <label class="event__offer-label" for="event-offer-${name}-1">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </label>
  </div>
`
  );
};

const createOffersMarkup = (offers) => {
  if (!offers.length) {
    return ``;
  }
  const offersMarkup = offers.map((offer) => createOfferMarkup(offer)).join(`\n`);
  return (
    `      <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offersMarkup}
    </div>
  </section>
`
  );
};

const createDetailsMarkup = (offers, destinationInfo) => {
  const offersMarkup = createOffersMarkup(offers);
  const destinationMarkup = createDestinationMarkup(destinationInfo);
  if (!offersMarkup && !destinationMarkup) {
    return ``;
  }
  return (
    `    <section class="event__details">
    ${offersMarkup}

    ${destinationMarkup}
  </section>
`
  );
};

const createDestinationOptionMarkup = (option) => {
  return (
    `          <option value="${option}"></option>
    `
  );
};

const createEditModeControls = (isFavorite) => {
  const checkedAttrib = isFavorite ? `checked` : ``;
  return (
    `      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${checkedAttrib}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
`
  );
};

export const createEditFormTemplate = (eventTypes, event) => {
  const isEditMode = !!event;
  if (!isEditMode) {
    event = generateDefaultEvent();
  }
  const {type, preposition, destination, startDate, endDate, price, offers, destinationInfo, isFavorite} = event;

  const eventTypeListMarkup = createEventTypeListMarkup(eventTypes, type);
  const destinationOptions = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];
  const destinationOptionsMarkup = destinationOptions.map((option) => createDestinationOptionMarkup(option)).join(`\n`);
  const destinationLabelText = `${capitalizeFirstLetter(type)} ${preposition}`;
  const destinationName = destination;
  const positionClass = isEditMode ? `` : `trip-events__item`;
  const resetButtonCaption = isEditMode ? `Delete` : `Cancel`;
  const editModeControls = isEditMode ? createEditModeControls(isFavorite) : ``;
  const detailsMarkup = createDetailsMarkup(offers, destinationInfo);
  const startDateValue = `${formatDate(startDate)} ${formatTime(startDate)}`;
  const endDateValue = `${formatDate(endDate)} ${formatTime(endDate)}`;

  return (
    `          <form class="${positionClass}  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        ${eventTypeListMarkup}
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${destinationLabelText}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationOptionsMarkup}
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${resetButtonCaption}</button>

      ${editModeControls}
    </header>
    ${detailsMarkup}
  </form>
`
  );
};
