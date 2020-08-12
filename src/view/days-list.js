import {createElement} from '../utils.js';

const createTripDaysMarkup = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class DayListView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDaysMarkup();
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
