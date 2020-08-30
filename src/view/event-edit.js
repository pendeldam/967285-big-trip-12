import SmartView from './smart.js';
import {EVENT_TYPES, EVENT_DESTINATIONS} from '../const.js';
import {formatTime} from '../utils/event.js';
import flatpickr from 'flatpickr';
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import moment from "moment";

const BLANK_EVENT = {
  price: 0,
  destination: ``,
  dateFrom: null,
  dateTo: null,
  offers: null
};

const isPropertyAvailable = (property, value, array, option) => {
  if (!value) {
    return false;
  }

  const target = array.find((it) => it[property] === value);
  return Boolean(target[option].length);
};

const createTypesMarkup = (types) => {
  return types.map((type, index) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-${index + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" data-type="${type}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${index + 1}">${type}</label>
      </div>`
    );
  }).join(`\n`);
};

const createDestinationsMarkup = (destinations) => {
  return destinations.map((destination) => `<option value="${destination}"></option>`).join(`\n`);
};

const createDescriptionMarkup = (array, name) => {
  const target = array.find((it) => it.name === name);

  const createPhotosMarkup = () => {
    return target.photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(`\n`);
  };

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${target.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotosMarkup()}
        </div>
      </div>
    </section>`
  );
};

const createOffersListMarkup = (offers, type, event) => {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${createOfferItemMarkup(offers, type, event)}</div>
    </section>`
  );
};

const createOfferItemMarkup = (offers, type, event) => {
  const target = offers.find((it) => it.type === type);

  return target.offers.map((offer) => {
    const index = event.offers !== null ? event.offers.findIndex((it) => it.title === offer.title) : -1;
    const isChecked = index !== -1 ? `checked` : ``;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${event.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${offer.id}-${event.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createTripEventEditMarkup = (event = BLANK_EVENT, details, offers) => {
  const {id, type, dateFrom, dateTo, price, destination, isFavorite} = event;
  const preposition = [`Check-in`, `Sightseeing`, `Restaurant`].includes(type) ? `in` : `to`;

  const isDateAvailable = (date) => {
    if (!date) {
      return ``;
    }

    return `${date.toLocaleDateString()} ${formatTime(date)}`;
  };

  return (
    `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createTypesMarkup(EVENT_TYPES.slice(0, 7))}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createTypesMarkup(EVENT_TYPES.slice(7))}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createDestinationsMarkup(EVENT_DESTINATIONS)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${isDateAvailable(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${isDateAvailable(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${id}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
      ${isPropertyAvailable(`type`, type, offers, `offers`) ? createOffersListMarkup(offers, type, event) : ``}
      ${isPropertyAvailable(`name`, destination, details, `description`) ? createDescriptionMarkup(details, destination) : ``}
      </section>
    </form>
    </li>`
  );
};

export default class EventEdit extends SmartView {
  constructor(event, details, offers) {
    super();
    this._data = EventEdit.parseEventToData(event);
    this._details = details;
    this._offers = offers;
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return createTripEventEditMarkup(this._data, this._details, this._offers);
  }

  _setDatePicker() {
    if (this._datepicker) {
      Object.values(this._datepicker).forEach((it) => {
        it.destroy();
      });

      this._datepicker = null;
    }

    const inputs = this.getElement().querySelectorAll(`.event__input--time`);

    [...inputs].forEach((input) => {
      const date = input.name === `event-start-time` ? this._data.dateFrom : this._data.dateTo;
      const limit = input.name === `event-end-time` ? this._data.dateFrom : null;

      this._datepicker = Object.assign({}, this._datepicker, {
        [input.name]: flatpickr(input, {
          altInput: true,
          altFormat: `d/m/y H:i`,
          allowInput: true,
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          defaultDate: date,
          minDate: limit,
          onChange: this._dateChangeHandler
        })
      });
    });
  }

  reset(task) {
    this.updateData(EventEdit.parseEventToData(task));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setSubmitFormHandler(this._callback.submitForm);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatePicker();
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._priceChangeHandler);

    if (this._data.offers) {
      this.getElement().querySelector(`.event__offer-checkbox`).addEventListener(`click`, this._offerChangeHandler);
    }
  }

  setSubmitFormHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _dateChangeHandler([date], str, picker) {
    if (picker.element.name === `event-start-time`) {
      if (date > this._datepicker[`event-end-time`].latestSelectedDateObj) {
        this.updateData({
          dateFrom: date,
          dateTo: null,
        }, true);

        this._datepicker[`event-end-time`].set(`_minDate`, date);
      } else {
        this.updateData({
          dateFrom: date,
        }, true);
        this._datepicker[`event-end-time`].set(`_minDate`, date);
      }

    } else {
      this.updateData({
        dateTo: date,
      }, true);
    }
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.dataset.type,
      offers: []
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    });
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    // console.log(evt.target);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    if (!this._data.dateFrom || !this._data.dateTo) {
      this._data.duration = null;
    } else {
      this._data.duration = moment(this._data.dateFrom).diff(this._data.dateTo);
    }
    this._callback.submitForm(EventEdit.parseDataToEvent(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseDataToEvent(this._data));
  }

  static parseEventToData(event) {
    return Object.assign({}, event);
  }

  static parseDataToEvent(data) {
    return Object.assign({}, data);
  }

}
