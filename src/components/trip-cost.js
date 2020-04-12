const getOffersTotalPrice = (total, offer) => total + (offer.isSelected ? offer.price : 0);

const getEventTotalPrice = (total, event) => total + event.price + event.offers.reduce(getOffersTotalPrice, 0);

const getTotalPrice = (events) => events.reduce(getEventTotalPrice, 0);

export const createTripCostTemplate = (events) => {
  return (
    `    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(events)}</span>
  </p>
`
  );
};
