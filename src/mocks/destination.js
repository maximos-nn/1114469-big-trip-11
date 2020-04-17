import {getRandomInteger, getRandomIntegers} from "../utils/random";

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
const destinations = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

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

export const generateDestinations = () => {
  return destinations.map((destination) => {
    return {
      destination,
      destinationInfo: Math.random() > 0.3 ? getRandomDestinationInfo() : {}
    };
  });
};
