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

export const updateEvent = (array, event) => {
  const index = array.findIndex((it) => it.id === event.id);

  if (index === -1) {
    return array;
  }

  return [...array.slice(0, index), event, ...array.slice(index + 1)];
};
