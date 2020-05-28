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

  removeElement() {
    this._element = null;
  }

  show(hiddenClass) {
    if (this._element) {
      this._element.classList.remove(hiddenClass);
    }
  }

  hide(hiddenClass) {
    if (this._element) {
      this._element.classList.add(hiddenClass);
    }
  }

  _setUIHandlers() {}
}
