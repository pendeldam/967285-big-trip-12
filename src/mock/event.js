import {getRandomIntegerNumber, getRandomArrayItem} from '../utils/event.js';
import {options} from './offer.js';
import {details} from './description.js';

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateRandomDate = () => {
  const dateStart = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;

  dateStart.setDate(dateStart.getDate() + getRandomIntegerNumber(0, 11) * sign);
  dateStart.setHours(dateStart.getHours() + getRandomIntegerNumber(0, 11) * sign);
  dateStart.setMinutes(dateStart.getMinutes() + getRandomIntegerNumber(0, 11) * sign);

  const dateEnd = new Date(dateStart);
  dateEnd.setMinutes(dateEnd.getMinutes() + getRandomIntegerNumber(30, 2500));

  return {dateStart, dateEnd};
};

const getEventOffers = (type, array) => {
  let result = [];

  for (const offer of array) {
    if (offer.type === type) {
      offer.offers.forEach((it) => {
        if (Math.random() > 0.5) {
          result.push(it);
        }
      });
    }
  }
  return result;
};

export const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map((event, index) => {
      const type = getRandomArrayItem([...options.keys()]);
      const date = generateRandomDate();

      event = {
        id: index,
        type,
        price: getRandomIntegerNumber(100, 1001),
        isFavorite: Math.random() > 0.5 ? false : true,
        dateFrom: date.dateStart,
        dateTo: date.dateEnd,
        destination: getRandomArrayItem([...details.values()]),
        offers: getEventOffers(type, [...options.values()])
      };

      return event;
    });
};
