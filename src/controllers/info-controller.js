import TripInfo from "../components/trip-info";
import TripCost from "../components/trip-cost";
import {render, RenderPosition, replace, remove} from "../utils/render";

export default class InfoController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._tripInfoComponent = null;
    this._tripCostComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._model.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldInfoComponent = this._tripInfoComponent;
    const oldCostComponent = this._tripCostComponent;

    const events = this._model.allEvents.slice().sort((a, b) => a.startDate - b.startDate);

    this._tripInfoComponent = new TripInfo(events);
    this._tripCostComponent = new TripCost(events);

    if (oldInfoComponent && oldCostComponent) {
      replace(this._tripInfoComponent, oldInfoComponent);
      remove(oldCostComponent);
      remove(oldInfoComponent);
    } else {
      render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
    render(this._tripInfoComponent.getElement(), this._tripCostComponent);
  }

  _onDataChange() {
    this.render();
  }
}
