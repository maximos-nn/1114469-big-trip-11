import {Filter} from "../components/filter";
import {render, replace} from "../utils/render";
import {FilterType, filterEvents} from "../utils/filter";

const getAvailableFilters = (events) => {
  const totalCount = events.length;
  if (!totalCount) {
    return {[FilterType.FUTURE]: false, [FilterType.PAST]: false};
  }
  const futureCount = filterEvents(events, FilterType.FUTURE).length;
  if (futureCount === totalCount) {
    return {[FilterType.FUTURE]: true, [FilterType.PAST]: false};
  }
  if (!futureCount) {
    return {[FilterType.FUTURE]: false, [FilterType.PAST]: true};
  }
  return {[FilterType.FUTURE]: true, [FilterType.PAST]: true};
};

export class FilterController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._model.filter = this._activeFilterType;
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._model.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isActive: filterType === this._activeFilterType,
        isEnabled: filterType === FilterType.EVERYTHING || (getAvailableFilters(this._model.allEvents))[filterType]
      };
    });

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new Filter(filters);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  reset() {
    this._activeFilterType = FilterType.EVERYTHING;
    this._model.filter = this._activeFilterType;
    this.render();
  }

  _onFilterTypeChange(newFilterType) {
    this._activeFilterType = newFilterType;
    this._model.filter = newFilterType;
  }

  _onDataChange() {
    this.render();
  }
}
