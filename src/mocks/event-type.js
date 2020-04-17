import {getRandomInteger, getRandomIntegers} from "../utils/random";

const offers = [
  {title: `Add luggage`, name: `luggage`, price: 30, isSelected: true},
  {title: `Switch to comfort class`, name: `comfort`, price: 100, isSelected: true},
  {title: `Add meal`, name: `meal`, price: 15, isSelected: false},
  {title: `Choose seats`, name: `seats`, price: 5, isSelected: false},
  {title: `Travel by train`, name: `train`, price: 40, isSelected: false}
];

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

const getRandomOffers = () => {
  const count = getRandomInteger(0, offers.length + 1);
  return getRandomIntegers(0, offers.length, count).map((index) => Object.assign({}, offers[index]));
};

const setOffers = (group) => {
  group.offers = group.types.reduce((resultObj, type) => {
    resultObj[type] = getRandomOffers();
    return resultObj;
  }, {});
  return group;
};

export const generateEventTypes = () => {
  return types.map((group) => setOffers(group));
};
