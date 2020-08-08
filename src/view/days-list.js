import {createTripDayMarkup} from './day.js';

export const createTripDaysMarkup = (days, events) => {
  const daysMarkup = [...days]
    .map((day, index) => createTripDayMarkup(day, index, events))
    .join(`\n`);

  return `<ul class="trip-days">${daysMarkup}</ul>`;
};
