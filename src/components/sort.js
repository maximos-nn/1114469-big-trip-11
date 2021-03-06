import AbstractComponent from "./abstract-component";

const SortType = {
  EVENT: `sort-event`,
  PRICE: `sort-price`,
  TIME: `sort-time`
};

const createSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.EVENT}" checked>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.TIME}">
      <label class="trip-sort__btn" for="sort-time">
        Time
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.PRICE}">
      <label class="trip-sort__btn" for="sort-price">
        Price
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>

    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.EVENT;
    this._handler = null;

    this._onChange = this._onChange.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _setUIHandlers() {
    this._element.addEventListener(`change`, this._onChange);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    if (typeof handler === `function`) {
      this._handler = handler;
    }
  }

  _onChange() {
    const newSortType = this._element.querySelector(`input[name="trip-sort"]:checked`).value;
    if (newSortType === this._currentSortType) {
      return;
    }
    this._element.querySelector(`.trip-sort__item--day`).textContent = newSortType === SortType.EVENT ? `Day` : ``;
    this._currentSortType = newSortType;
    if (this._handler) {
      this._handler(newSortType);
    }
  }
}

export {SortType};
