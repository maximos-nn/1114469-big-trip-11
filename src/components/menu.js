import AbstractComponent from "./abstract-component";

const MenuItem = {
  TABLE: `Table`,
  STATISTICS: `Stats`
};

const extractText = (node) => {
  const text = [...node.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
  return text && text.textContent.trim();
};

const createMenuTemplate = (menu) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menu.map((item) => `<a class="trip-tabs__btn" href="#">${item}</a>`).join(`\n`)}
  </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();
    this._currentItem = MenuItem.TABLE;
    this._handler = null;

    this._onClick = this._onClick.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(Object.values(MenuItem));
  }

  _setUIHandlers() {
    this.getElement().addEventListener(`click`, this._onClick);
  }

  setActiveItem(menuItem) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((item) => {
      item.classList.remove(`trip-tabs__btn--active`);
      if (extractText(item) === menuItem) {
        item.classList.add(`trip-tabs__btn--active`);
      }
    });
  }

  setMenuItemChangeHandler(handler) {
    if (typeof handler === `function`) {
      this._handler = handler;
    }
  }

  _onClick(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    const newItem = extractText(evt.target);
    if (newItem === this._currentItem) {
      return;
    }
    this._currentItem = newItem;
    if (this._handler) {
      this._handler(newItem);
    }
  }
}

export {MenuItem};
