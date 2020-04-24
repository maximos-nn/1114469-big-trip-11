import moment from "moment";

const castValue = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  return moment(date).format(`kk:mm`);
};

const formatDate = (date) => {
  return moment(date).format(`DD/MM/YYYY`);
};

const formatISODate = (date) => {
  return moment(date).toISOString();
};

const formatDuration = (firstDate, secondDate) => {
  const duration = moment.duration(Math.abs(firstDate - secondDate));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  if (days) {
    return `${castValue(days)}D ${castValue(hours)}H ${castValue(minutes)}M`;
  }
  if (hours) {
    return `${castValue(hours)}H ${castValue(minutes)}M`;
  }
  return `${castValue(minutes)}M`;
};

const formatMonthDayDate = (date) => {
  return moment(date).format(`MMM DD`);
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
