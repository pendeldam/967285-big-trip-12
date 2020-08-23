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

const castTimeFormat = (value) => {
  return String(value).padStart(2, `0`);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDuration = (value) => {
  const days = Math.floor(value / 1440);
  const hours = Math.floor((value - (days * 1440)) / 60);
  const minutes = (value - (days * 1440)) - (60 * hours);

  if (value >= 1440) {
    return `${castTimeFormat(days)}D ${castTimeFormat(hours)}H ${castTimeFormat(minutes)}M`;
  } else if (value >= 60 && value < 1440) {
    return `${castTimeFormat(hours)}H ${castTimeFormat(minutes)}M`;
  } else {
    return `${castTimeFormat(minutes)}M`;
  }
};

export const updateEvent = (array, event) => {
  const index = array.findIndex((it) => it.id === event.id);

  if (index === -1) {
    return array;
  }

  return [...array.slice(0, index), event, ...array.slice(index + 1)];
};
