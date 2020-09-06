import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = null;
  }

  getOffers() {
    return this._offers;
  }

  setOffers(offers) {
    this._offers = offers;
  }
}
