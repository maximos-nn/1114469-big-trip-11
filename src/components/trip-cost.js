import {createElement} from "../utils";

const createTripCostTemplate = (totalPrice) => {
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`
  );
};

export default class TripCost {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    const getOffersTotalPrice = (total, offer) => total + (offer.isSelected ? offer.price : 0);

    const getEventTotalPrice = (total, event) => total + event.price + event.offers.reduce(getOffersTotalPrice, 0);

    const getTotalPrice = (events) => events.reduce(getEventTotalPrice, 0);

    return createTripCostTemplate(getTotalPrice(this._events));
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
