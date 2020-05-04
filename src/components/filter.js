import {AbstractComponent} from "./abstract-component";

const createFilterMarkup = (filter) => {
  return (
    `<div class="trip-filters__filter">
    <input
      id="filter-${filter.name}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filter.name}"
      ${filter.isActive ? `checked` : ``}
      ${filter.isDisabled ? `disabled` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
  </div>`
  );
};

const createFiltersTemplate = (filters) => {
  return (
    `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterMarkup(filter)).join(`\n`)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
};

const getActiveFilterType = (filters) => {
  const activeFilter = filters.find((filter) => filter.isActive);
  return activeFilter ? activeFilter.name : ``;
};

export class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilterType = getActiveFilterType(filters);
    this._handler = null;

    this._onChange = this._onChange.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  _setUIHandlers() {
    this._element.addEventListener(`change`, this._onChange); // debounce?
  }

  _onChange() {
    const newFilterType = this._element.querySelector(`input[name="trip-filter"]:checked`).value;
    if (newFilterType === this._currentFilterType) {
      return;
    }
    this._currentFilterType = newFilterType;
    if (this._handler) {
      this._handler(newFilterType);
    }
  }

  setFilterTypeChangeHandler(handler) {
    if (typeof handler === `function`) {
      this._handler = handler;
    }
  }
}
