import {generateEventTypes} from "./event-type";

const DATE_DEVIATION = 24 * 60;
const MIN_PRICE = 10;
const MAX_PRICE = 500;
const lorem = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const offers = [
  {title: `Add luggage`, name: `luggage`, price: 30, isSelected: true},
  {title: `Switch to comfort class`, name: `comfort`, price: 100, isSelected: true},
  {title: `Add meal`, name: `meal`, price: 15, isSelected: false},
  {title: `Choose seats`, name: `seats`, price: 5, isSelected: false},
  {title: `Travel by train`, name: `train`, price: 40, isSelected: false}
];
const destinations = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomIntegers = (min, max, count) => {
  const integers = new Set();
  while (integers.size < count) {
    integers.add(getRandomInteger(min, max));
  }
  return [...integers];
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length)];

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.2 ? 1 : -1;
  const diffValue = sign * getRandomInteger(0, DATE_DEVIATION);
  targetDate.setMinutes(targetDate.getMinutes() + diffValue);
  return targetDate;
};

const getRandomPhotos = () => {
  const count = getRandomInteger(0, 6);
  return getRandomIntegers(1, 6, count).map((index) => `img/photos/${index}.jpg`);
};

const getRandomDescription = () => {
  const count = getRandomInteger(1, 6);
  return getRandomIntegers(0, lorem.length, count).map((index) => lorem[index]).join(` `);
};

const getRandomDestinationInfo = () => {
  return {
    description: getRandomDescription(),
    photos: getRandomPhotos()
  };
};

const getRandomOffers = () => {
  const count = getRandomInteger(0, offers.length + 1);
  return getRandomIntegers(0, offers.length, count).map((index) => Object.assign({}, offers[index], {isSelected: Math.random() > 0.7}));
};

const generateEvent = () => {
  const firstDate = getRandomDate();
  const secondDate = getRandomDate();
  const {preposition, types} = getRandomArrayElement(generateEventTypes());
  return {
    type: getRandomArrayElement(types),
    preposition,
    destination: getRandomArrayElement(destinations),
    startDate: firstDate > secondDate ? secondDate : firstDate,
    endDate: firstDate > secondDate ? firstDate : secondDate,
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: getRandomOffers(),
    destinationInfo: Math.random() > 0.3 ? getRandomDestinationInfo() : {},
    isFavorite: Math.random() > 0.5
  };
};

export const generateEvents = (count) => {
  return Array(count).fill(``).map(generateEvent);
};

export const generateDefaultEvent = () => {
  return {
    type: `flight`,
    preposition: `to`,
    destination: `Geneva`,
    startDate: new Date(),
    endDate: new Date(),
    price: ``,
    offers,
    destinationInfo: {
      description: `Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.`,
      photos: [...Array(5).keys()].map((index) => `img/photos/${index + 1}.jpg`),
    },
    isFavorite: false
  };
};
