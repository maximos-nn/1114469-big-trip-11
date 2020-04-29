import {Filter} from "../components/filter";
import {generateFilter} from "../mocks/filter";
import {render} from "../utils/render";

export class FilterController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
  }

  render() {
    render(this._container, new Filter(generateFilter()));
  }
}
