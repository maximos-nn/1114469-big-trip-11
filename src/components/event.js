import {formatDuration, formatTime, capitalizeFirstLetter} from "../utils";

const OFFERS_COUNT = 3;

const createOffersMarkup = (offers) => {
  return offers.filter((offer) => offer.isSelected).slice(0, OFFERS_COUNT)
  .map((offer) => {
    const {title, price} = offer;
    return (
      `      <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>
`
    );
  }).join(`\n`);
};

const createOffersListMarkup = (offers) => {
  return (
    `      <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${createOffersMarkup(offers)}
    </ul>
`
  );
};

export const createEventTemplate = (event) => {
  const {type, preposition, destination, startDate, endDate, price, offers} = event;
  const title = `${capitalizeFirstLetter(type)} ${preposition} ${destination}`;
  const tagStartDate = startDate.toISOString();
  const startTime = formatTime(startDate);
  const tagEndDate = endDate.toISOString();
  const endTime = formatTime(endDate);
  const duration = formatDuration(endDate, startDate);

  const offersMarkup = offers ? createOffersListMarkup(offers) : ``;
  return (
    `    <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${title}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${tagStartDate}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${tagEndDate}">${endTime}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      ${offersMarkup}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
`
  );
};
