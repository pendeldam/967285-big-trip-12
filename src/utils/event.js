import moment from "moment";

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  return array[getRandomIntegerNumber(0, array.length)];
};

export const getRandomArray = (length, cb) => {
  return new Array(length)
    .fill(``)
    .map(cb);
};

export const formatType = (type) => {
  return type.replace(type.charAt(0), type.charAt(0).toUpperCase());
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDuration = (dateFrom, dateTo) => {
  const diff = moment(dateFrom).diff(dateTo);
  const duration = moment.duration(diff);
  const days = duration.days() ? `${String(duration.days()).replace(`-`, ``).padStart(2, `0`)}D` : ``;
  const hours = duration.hours() ? `${String(duration.hours()).replace(`-`, ``).padStart(2, `0`)}H` : ``;
  const minutes = duration.minutes() ? `${String(duration.minutes()).replace(`-`, ``).padStart(2, `0`)}M` : ``;

  return `${days} ${hours} ${minutes}`;
};

export const sortByDefault = (eventA, eventB) => {
  return eventA.dateFrom - eventB.dateFrom;
};

export const sortByTime = (eventA, eventB) => {
  return (moment(eventA.dateFrom).diff(eventA.dateTo)) - (moment(eventB.dateFrom).diff(eventB.dateTo));
};

export const sortByPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};

export const isEqual = (a, b) => {
  return (a === b) ? true : false;
};
