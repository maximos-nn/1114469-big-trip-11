import {AbstractComponent} from "./abstract-component";

const createTripCostTemplate = (totalPrice) => {
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`
  );
};

export class TripCost extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    const getOffersTotalPrice = (total, offer) => total + (offer.isSelected ? offer.price : 0);

    const getEventTotalPrice = (total, event) => total + event.price + event.offers.reduce(getOffersTotalPrice, 0);

    const getTotalPrice = (events) => events.reduce(getEventTotalPrice, 0);

    return createTripCostTemplate(getTotalPrice(this._events));
  }
}
