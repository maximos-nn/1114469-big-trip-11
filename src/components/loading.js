import {AbstractComponent} from "./abstract-component";

const createLoadingTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
