const types = [
  {
    group: `Transfer`,
    preposition: `to`,
    types: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
    offers: {}
  },
  {
    group: `Activity`,
    preposition: `in`,
    types: [`check-in`, `sightseeing`, `restaurant`],
    offers: {}
  }
];

const setOffer = (offer) => Object.assign({}, offer, {name: offer.title.toLowerCase().replace(/ /g, `-`), isSelected: false});

const setOffers = (group, typeOffers) => {
  group.offers = group.types.reduce((result, type) => {
    result[type] = typeOffers.get(type).map(setOffer);
    return result;
  }, {});
  return group;
};

export default class Offers {
  static parse(offers) {
    const typeOffers = offers.reduce((result, offer) => {
      result.set(offer.type, offer.offers);
      return result;
    }, new Map());
    return types.map((group) => setOffers(group, typeOffers));
  }
}
