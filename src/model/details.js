import Observer from '../utils/observer.js';

export default class Details extends Observer {
  constructor() {
    super();
    this._details = [];
  }

  getDetails() {
    return this._details;
  }

  setDetails(details) {
    this._details = details.slice();
  }
}
