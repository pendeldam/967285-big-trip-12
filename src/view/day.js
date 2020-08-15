import AbstractView from './abstract.js';

export default class DayView extends AbstractView {
  constructor(day, index, events) {
    super();
    this._day = day;
    this._index = index;
    this._events = events;
  }

  getTemplate() {
    const eventsByDay = this._events.filter((event) => event.dateFrom.toLocaleDateString() === this._day);
    const date = eventsByDay[0].dateFrom;
    const ISOdate = date.toISOString().split(`T`);
    const shortDate = date.toLocaleDateString(`en-US`, {month: `short`, day: `2-digit`});

    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._index + 1}</span>
          <time class="day__date" datetime="${ISOdate[0]}">${shortDate}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
    );
  }
}
