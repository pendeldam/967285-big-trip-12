import {getRandomIntegerNumber, getRandomArrayItem, getRandomArray} from '../utils.js';
import {EVENT_TYPE, EVENT_DESTINATION, EVENT_DESCRIPTION, EVENTS_OFFERS} from '../const.js';

const generateRandomText = () => getRandomArrayItem(EVENT_DESCRIPTION.split(`.`));

const generateRandomPhoto = () => {
  return {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: getRandomArrayItem(EVENT_DESCRIPTION.split(`.`))
  };
};

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

export const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map((event, index) => {
      const type = getRandomArrayItem(EVENT_TYPE);
      const date = generateRandomDate();

      const getEventOffers = (eventType, offers) => {
        for (const offer of offers) {
          if (offer.type === eventType) {
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

      event = {
        id: index,
        type,
        price: getRandomIntegerNumber(100, 1001),
        isFavorite: Math.random() > 0.5 ? false : true,
        dateFrom: date.dateStart,
        dateTo: date.dateEnd,
        duration: date.duration,
        destination: {
          name: getRandomArrayItem(EVENT_DESTINATION),
          description: getRandomArray(getRandomIntegerNumber(1, 6), generateRandomText).join(`\n`),
          photos: getRandomArray(getRandomIntegerNumber(1, 6), generateRandomPhoto),
        },
        offers: getEventOffers(type, EVENTS_OFFERS)
      };

      return event;
    });
};
