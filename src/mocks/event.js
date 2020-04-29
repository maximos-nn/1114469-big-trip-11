import {getRandomInteger, getRandomArrayElement} from "../utils/random";

const DATE_DEVIATION = 24 * 60;
const MIN_PRICE = 10;
const MAX_PRICE = 500;

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.2 ? 1 : -1;
  const diffValue = sign * getRandomInteger(0, DATE_DEVIATION);
  targetDate.setMinutes(targetDate.getMinutes() + diffValue);
  return targetDate;
};

const generateEvent = (eventTypes, destinations) => {
  const firstDate = getRandomDate();
  const secondDate = getRandomDate();
  const {preposition, types, offers} = getRandomArrayElement(eventTypes);
  const type = getRandomArrayElement(types);
  const {destination, destinationInfo} = getRandomArrayElement(destinations);
  return {
    id: String(new Date() + Math.random()),
    type,
    preposition,
    destination,
    startDate: firstDate > secondDate ? secondDate : firstDate,
    endDate: firstDate > secondDate ? firstDate : secondDate,
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: offers[type].map((offer) => Object.assign(offer, {isSelected: Math.random() > 0.7})),
    destinationInfo,
    isFavorite: Math.random() > 0.5
  };
};

export const generateEvents = (count, eventTypes, destinations) => {
  return Array(count).fill(``).map(() => generateEvent(eventTypes, destinations));
};

export const generateDefaultEvent = () => {
  return {
    type: `flight`,
    preposition: `to`,
    destination: `Geneva`,
    startDate: new Date(),
    endDate: new Date(),
    price: ``,
    offers: [],
    destinationInfo: {
      description: `Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.`,
      photos: [...Array(5).keys()].map((index) => `img/photos/${index + 1}.jpg`),
    },
    isFavorite: false
  };
};
