import AbstractView from './abstract.js';

export default class DayView extends AbstractView {
  constructor(day, index) {
    super();
    this._day = day;
    this._index = index;
  }

  getTemplate() {
    const date = this._day ? new Date(this._day).toLocaleDateString(`en-US`, {month: `short`, day: `2-digit`}) : ``;

    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._index !== null ? this._index + 1 : ``}</span>
          <time class="day__date" datetime="${this._day}">${date}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
    );
  }
}
