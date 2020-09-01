import {EVENT_DESTINATIONS, EVENT_DESCRIPTION} from '../const.js';
import {getRandomIntegerNumber, getRandomArrayItem, getRandomArray} from '../utils/event.js';

const generateRandomText = () => getRandomArrayItem(EVENT_DESCRIPTION.split(`.`));

const generateRandomPhoto = () => {
  return {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: getRandomArrayItem(EVENT_DESCRIPTION.split(`.`))
  };
};
/*
export const generateDetails = () => {
  return EVENT_DESTINATIONS.map((destination) => {
    const description = getRandomArray(getRandomIntegerNumber(0, 6), generateRandomText).join(`\n`);

    return {
      name: destination,
      description,
      pictures: description ? getRandomArray(getRandomIntegerNumber(1, 6), generateRandomPhoto) : ``
    };
  });
};
*/
export const details = new Map();

EVENT_DESTINATIONS.forEach((name) => {
  const description = getRandomArray(getRandomIntegerNumber(0, 6), generateRandomText).join(`\n`);
  const pictures = description ? getRandomArray(getRandomIntegerNumber(1, 6), generateRandomPhoto) : ``;

  details.set(name, {name, description, pictures});
});
