import {AbstractComponent} from "./abstract-component";

const createMenuTemplate = (menu) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menu.map((item) => `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : ``}" href="${item.href}">${item.title}</a>`).join(`\n`)}
  </nav>`
  );
};

export class Menu extends AbstractComponent {
  constructor(menu) {
    super();
    this._menu = menu;
  }

  getTemplate() {
    return createMenuTemplate(this._menu);
  }
}
