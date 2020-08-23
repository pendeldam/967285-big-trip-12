import {getRandomIntegerNumber, getRandomArrayItem} from '../utils/event.js';
import {EVENT_TYPES, EVENT_DESTINATIONS} from '../const.js';
import {offers} from '../main.js';

const generateRandomDate = () => {
  const dateStart = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;

  dateStart.setDate(dateStart.getDate() + getRandomIntegerNumber(0, 11) * sign);
  dateStart.setHours(dateStart.getHours() + getRandomIntegerNumber(0, 11) * sign);
  dateStart.setMinutes(dateStart.getMinutes() + getRandomIntegerNumber(0, 11) * sign);

  const dateEnd = new Date(dateStart);
  dateEnd.setMinutes(dateEnd.getMinutes() + getRandomIntegerNumber(30, 2500));
  const duration = (dateEnd.getTime() - dateStart.getTime()) / 60000;

  return {dateStart, dateEnd, duration};
};

const getEventOffers = (type, array) => {
  for (const offer of array) {
    if (offer.type === type) {
      let result = [];
      offer.offers.forEach((it) => {
        if (Math.random() > 0.5) {
          result.push(it);
        }
      });
      result = result.length ? result : null;
      return result;
    }
  }
  return null;
};

export const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map((event, index) => {
      const type = getRandomArrayItem(EVENT_TYPES);
      const date = generateRandomDate();

      event = {
        id: index,
        type,
        price: getRandomIntegerNumber(100, 1001),
        isFavorite: Math.random() > 0.5 ? false : true,
        dateFrom: date.dateStart,
        dateTo: date.dateEnd,
        duration: date.duration,
        destination: getRandomArrayItem(EVENT_DESTINATIONS),
        offers: getEventOffers(type, offers)
      };

      return event;
    });
};
