import {createElement} from "../utils";

const createMenuTemplate = (menu) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menu.map((item) => `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : ``}" href="${item.href}">${item.title}</a>`).join(`\n`)}
  </nav>`
  );
};

export default class Menu {
  constructor(menu) {
    this._menu = menu;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._menu);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
