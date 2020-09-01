import {EVENT_OFFERS, EVENT_TYPES} from '../const.js';
import {getRandomIntegerNumber, getRandomArrayItem} from '../utils/event.js';

export const options = new Map();

EVENT_TYPES.forEach((type) => {
  let offers = [];
  const count = getRandomIntegerNumber(0, 5);

  for (let i = 0; i < count; i++) {
    const offer = getRandomArrayItem(EVENT_OFFERS);
    const index = offers.findIndex((it) => it.title === offer.title);

    if (index === -1) {
      offers.push(offer);
    }
  }

  options.set(type, {type, offers});
});
