import he from 'he';
import AbstractView from './abstract.js';
import {formatType, formatTime, formatDuration} from '../utils/event.js';

const createOfferItemMarkup = (offers) => {
  return offers.slice(0, 3).map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }).join(`\n`);
};

const createOffersListMarkup = (offers) => {
  return (
    `<ul class="event__selected-offers">${createOfferItemMarkup(offers)}</ul>`
  );
};

const createTripEventMarkup = (event) => {
  const {type, price, destination, dateFrom, dateTo, offers} = event;
  const preposition = [`Check-in`, `Sightseeing`, `Restaurant`].includes(type) ? `in` : `to`;

  const isDateAvailable = (date) => {
    if (!date) {
      return ``;
    }

    return `${date.toISOString().split(`.`)}">${formatTime(date)}`;
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${formatType(type)} ${preposition} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${isDateAvailable(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${isDateAvailable(dateTo)}</time>
          </p>
          <p class="event__duration">${(dateFrom && dateTo) ? formatDuration(dateFrom, dateTo) : ``}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(price.toString())}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        ${offers ? createOffersListMarkup(offers) : ``}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventView extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventMarkup(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
