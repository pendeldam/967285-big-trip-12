import {FilterType} from '../const.js';

const now = new Date();

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.PAST]: (events) => events.filter((event) => event.dateFrom < now),
  [FilterType.FUTURE]: (events) => events.filter((event) => event.dateFrom > now)
};
