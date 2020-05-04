import {Filter} from "../components/filter";
import {render, replace} from "../utils/render";

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export class FilterController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isActive: filterType === this._activeFilterType,
        isDisabled: false
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

  _onFilterTypeChange(newFilterType) {
    this._activeFilterType = newFilterType;
  }
}
