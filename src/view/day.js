import {createTripEventMarkup} from './event.js';
import {createTripEventEditMarkup} from './event-edit.js';

export const createTripDayMarkup = (day, index, events) => {
  const eventsByDay = events.filter((event) => event.dateFrom.toLocaleDateString() === day);
  const eventsMarkup = eventsByDay
    .map((event) => {
      if (index === 0 && event === eventsByDay[0]) {
        return createTripEventEditMarkup(event);
      }
      return createTripEventMarkup(event);
    })
    .join(`\n`);

  const date = eventsByDay[0].dateFrom;
  const ISOdate = date.toISOString().split(`T`);
  const shortDate = date.toLocaleDateString(`en-US`, {month: `short`, day: `2-digit`});

  return (
    `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${ISOdate[0]}">${shortDate}</time>
    </div>
    <ul class="trip-events__list">${eventsMarkup}</ul>
  </li>`
  );
};
