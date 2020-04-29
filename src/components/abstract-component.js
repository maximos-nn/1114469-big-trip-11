import {createElement} from "../utils/render";

export class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Невозможно инстанцировать абстрактный класс AbstractComponent.`);
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error(`Необходимо реализовать абстрактный метод getTemplate().`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._setUIHandlers();
    }
    return this._element;
  }

  _setUIHandlers() {}

  removeElement() {
    this._element = null;
  }
}
