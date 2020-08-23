import {EVENT_OFFERS, EVENT_TYPES} from '../const.js';
import {getRandomIntegerNumber, getRandomArrayItem} from '../utils/event.js';

export const generateOffers = () => {
  return EVENT_TYPES.map((type) => {
    let offers = [];
    const count = getRandomIntegerNumber(0, 5);

    for (let i = 0; i < count; i++) {
      const offer = getRandomArrayItem(EVENT_OFFERS);
      const index = offers.findIndex((it) => it.id === offer.id);

      if (index === -1) {
        offers.push(offer);
      }
    }

    return {
      type,
      offers
    };
  });
};
