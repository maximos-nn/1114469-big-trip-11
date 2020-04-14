const MS_PER_MINUTE = 1000 * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

const castValue = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castValue(date.getHours());
  const minutes = castValue(date.getMinutes());
  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const day = castValue(date.getDate());
  const month = castValue(date.getMonth() + 1);
  const year = castValue(date.getFullYear());
  return `${day}/${month}/${year}`;
};

const formatISODate = (date) => {
  const day = castValue(date.getDate());
  const month = castValue(date.getMonth() + 1);
  const year = castValue(date.getFullYear());
  return `${year}-${month}-${day}`;
};

const formatDuration = (firstDate, secondDate) => {
  const diff = Math.abs(firstDate - secondDate);
  const days = Math.floor(diff / MS_PER_DAY);
  const hours = Math.floor(diff % MS_PER_DAY / MS_PER_HOUR);
  const minutes = Math.floor(diff % MS_PER_DAY % MS_PER_HOUR / MS_PER_MINUTE);
  if (days) {
    return `${castValue(days)}D ${castValue(hours)}H ${castValue(minutes)}M`;
  }
  if (hours) {
    return `${castValue(hours)}H ${castValue(minutes)}M`;
  }
  return `${castValue(minutes)}M`;
};

const formatMonthDayDate = (date) => {
  return date.toDateString().split(` `).slice(1, 3).join(` `);
};

const getDate = (unixTime) => {
  const date = new Date(unixTime);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const capitalizeFirstLetter = ([first, ...rest]) => [first.toUpperCase(), ...rest].join(``);

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.parentNode.insertBefore(element, container.nextSibling);
      break;
  }
};

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

export {
  formatTime,
  formatDate,
  formatISODate,
  formatMonthDayDate,
  formatDuration,
  getDate,
  capitalizeFirstLetter,
  createElement,
  RenderPosition,
  render,
  getRandomInteger,
  getRandomIntegers,
  getRandomArrayElement
};
