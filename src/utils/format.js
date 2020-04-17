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

const capitalizeFirstLetter = ([first, ...rest]) => [first.toUpperCase(), ...rest].join(``);

export {
  formatTime,
  formatDate,
  formatISODate,
  formatMonthDayDate,
  formatDuration,
  capitalizeFirstLetter,
};
