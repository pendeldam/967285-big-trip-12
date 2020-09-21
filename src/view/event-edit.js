import he from 'he';
import SmartView from './smart.js';
import {formatTime, formatType} from '../utils/event.js';
import {EVENT_TYPES} from '../const.js';
import flatpickr from 'flatpickr';
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: `taxi`,
  price: 0,
  destination: {
    name: ``,
    description: ``,
    pictures: []
  },
  isFavorite: false,
  dateFrom: null,
  dateTo: null,
  offers: []
};

const createTypesMarkup = (types) => {
  return types.map((type, index) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-${index + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index + 1}">
          ${formatType(type)}
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createDestinationsMarkup = (details) => {
  return [...details.values()].map((destination) => `<option value="${destination.name}"></option>`).join(`\n`);
};

const createDescriptionMarkup = (destination, details) => {
  const createPhotosMarkup = () => {
    return details.get(destination.name).pictures.length
      ? details.get(destination.name).pictures
          .map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}" onerror="this.onerror=null;this.src='img/logo.png'">`)
          .join(`\n`)
      : ``;
  };

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${details.get(destination.name).description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotosMarkup()}
        </div>
      </div>
    </section>`
  );
};

const createOffersListMarkup = (offers, type, event, isDisabled) => {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${createOfferItemMarkup(offers, type, event, isDisabled)}</div>
    </section>`
  );
};

const createOfferItemMarkup = (offers, type, event, isDisabled) => {
  return offers.get(type).offers.map((offer) => {
    const id = offer.title.toLowerCase().split(` `).join(`-`);
    const index = event.offers.length ? event.offers.findIndex((it) => it.title === offer.title) : -1;
    const isChecked = index !== -1 ? `checked` : ``;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
          id="event-offer-${id}-${event.id}"
          type="checkbox"
          name="event-offer-${id}"
          data-title="${offer.title}"
          data-price="${offer.price}"
          ${isChecked}
          ${isDisabled ? `disabled` : ``}
        >
        <label class="event__offer-label" for="event-offer-${id}-${event.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const isDetailsAvailable = (destination, details) => {
  if (!destination) {
    return false;
  }

  return details.get(destination.name)
    ? Boolean(details.get(destination.name).description)
    : false;
};

const isOffersAvailable = (type, offers) => {
  return Boolean(offers.get(type).offers.length);
};

const createTripEventEditMarkup = (details, offers, event, isNewEvent) => {
  const {
    id,
    type,
    dateFrom,
    dateTo,
    price,
    destination,
    isFavorite,
    isDisabled,
    isSaving,
    isDeleting
  } = event;

  const preposition = [`Check-in`, `Sightseeing`, `Restaurant`].includes(formatType(type)) ? `in` : `to`;

  const isDateAvailable = (date) => {
    if (!date) {
      return ``;
    }

    return `${date.toLocaleDateString()} ${formatTime(date)}`;
  };

  return (
    `<li class="trip-events__item">
    <form class="trip-events__item event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input
            class="event__type-toggle  visually-hidden"
            id="event-type-toggle-${id}"
            type="checkbox"
            ${isDisabled ? `disabled` : ``}
          >

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
          ${formatType(type)} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination ? destination.name : ``}" list="destination-list-${id}" required>
          <datalist id="destination-list-${id}">
            ${createDestinationsMarkup(details)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-${id}"
            type="text"
            name="event-start-time"
            value="${isDateAvailable(dateFrom)}"
            required
            ${isDisabled ? `disabled` : ``}
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-${id}"
            type="text"
            name="event-end-time"
            value="${isDateAvailable(dateTo)}"
            required
            ${isDisabled ? `disabled` : ``}
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-${id}"
            type="text"
            name="event-price"
            value="${he.encode(price.toString())}"
            ${isDisabled ? `disabled` : ``}
          >
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>
          ${isSaving ? `Saving` : `Save`}
        </button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
          ${isNewEvent ? `Cancel` : `${isDeleting ? `Deleting` : `Delete`}`}
        </button>

      ${!isNewEvent ?
      `<input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-${id}">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`
      : ``}

      </header>

      <section class="event__details">
      ${isOffersAvailable(type, offers) ? createOffersListMarkup(offers, type, event, isDisabled) : ``}
      ${isDetailsAvailable(destination, details) ? createDescriptionMarkup(destination, details) : ``}
      </section>
    </form>
    </li>`
  );
};

export default class EventEdit extends SmartView {
  constructor(detailsModel, offersModel, isNewEvent, event = BLANK_EVENT) {
    super();
    this._data = EventEdit.parseEventToData(event);
    this._detailsModel = detailsModel;
    this._offersModel = offersModel;
    this._isNewEvent = isNewEvent;
    this._isFavorite = event.isFavorite;
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    const details = this._detailsModel.getDetails();
    const offers = this._offersModel.getOffers();

    return createTripEventEditMarkup(details, offers, this._data, this._isNewEvent);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      Object.values(this._datepicker).forEach((it) => {
        it.destroy();
      });

      this._datepicker = null;
    }
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
    this.getElement().querySelector(`.event__details`).addEventListener(`change`, this._offerChangeHandler);

  }

  _dateChangeHandler([date], str, picker) {
    const isFavorite = this._isFavorite;

    if (picker.element.name === `event-start-time`) {
      if (date > this._datepicker[`event-end-time`].latestSelectedDateObj) {
        this.updateData({
          dateFrom: date,
          dateTo: null,
          isFavorite
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
        isFavorite
      }, true);
    }
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    const isFavorite = this._isFavorite;

    this.updateData({
      type: evt.target.value,
      offers: [],
      isFavorite
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const isFavorite = this._isFavorite;
    const update = this._detailsModel.getDetails().has(evt.target.value)
      ? this._detailsModel.getDetails().get(evt.target.value)
      : null;

    this.updateData({
      destination: update,
      isFavorite
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const isFavorite = this._isFavorite;
    const update = isNaN(evt.target.value) ? 0 : +evt.target.value;

    this.updateData({
      price: update,
      isFavorite
    });
  }

  _offerChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    let update = this._data.offers.slice();
    const isFavorite = this._isFavorite;

    if (evt.target.checked) {
      update.push({
        title: evt.target.dataset.title,
        price: +evt.target.dataset.price
      });

      this.updateData({
        offers: update,
        isFavorite
      });

    } else {

      update = update.filter((offer) => offer.title !== evt.target.dataset.title);

      this.updateData({
        offers: update,
        isFavorite
      });
    }
  }

  setSubmitFormHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    if (!this._isNewEvent) {
      this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, this._favoriteClickHandler);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    const isFavorite = this._isFavorite;

    this._data = Object.assign({}, this._data, {isFavorite});

    this._callback.submitForm(EventEdit.parseDataToEvent(this._data));
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._isFavorite = !this._isFavorite;
    this.updateElement();
    this._callback.favoriteClick();
  }

  toggleFavorite() {
    this.getElement().querySelector(`.event__favorite-checkbox`).checked = this._isFavorite;
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
