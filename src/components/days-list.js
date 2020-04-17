import {AbstractComponent} from "./abstract-component";

const createDaysListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export class DayList extends AbstractComponent {
  getTemplate() {
    return createDaysListTemplate();
  }
}
