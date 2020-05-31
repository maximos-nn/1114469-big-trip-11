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
  group.offers = group.types.reduce((resultObj, type) => {
    resultObj[type] = typeOffers.get(type).map(setOffer);
    return resultObj;
  }, {});
  return group;
};

export class Offers {
  static parseOffers(data) {
    const typeOffers = data.reduce((resultMap, offers) => {
      resultMap.set(offers.type, offers.offers);
      return resultMap;
    }, new Map());
    return types.map((group) => setOffers(group, typeOffers));
  }
}
