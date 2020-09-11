import AbstractView from './abstract.js';

export default class NoEventsView extends AbstractView {
  constructor(isDataAvailble) {
    super();
    this._isDataAvailble = isDataAvailble;
  }
  getTemplate() {
    return (
      `<p class="trip-events__msg">
        ${this._isDataAvailble
        ? `Click New Event to create your first point`
        : `Service is unavailable. Try to connect later.`}
      </p>`
    );
  }
}
