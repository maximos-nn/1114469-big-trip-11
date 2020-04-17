export const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomIntegers = (min, max, count) => {
  const integers = new Set();
  while (integers.size < count) {
    integers.add(getRandomInteger(min, max));
  }
  return [...integers];
};

export const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length)];
