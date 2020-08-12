import {createElement} from '../utils.js';

const createTripDayMarkup = (day, index, events) => {
  const eventsByDay = events.filter((event) => event.dateFrom.toLocaleDateString() === day);
  const date = eventsByDay[0].dateFrom;
  const ISOdate = date.toISOString().split(`T`);
  const shortDate = date.toLocaleDateString(`en-US`, {month: `short`, day: `2-digit`});

  return (
    `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${ISOdate[0]}">${shortDate}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`
  );
};

export default class DayView {
  constructor(day, index, events) {
    this._day = day;
    this._index = index;
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createTripDayMarkup(this._day, this._index, this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
