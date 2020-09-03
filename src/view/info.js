import AbstractView from './abstract.js';
import moment from "moment";

const destinationMarkup = (events) => {
  if (events.length > 3) {
    return `${events[0].destination.name} &mdash; ... &mdash; ${events[events.length - 1].destination.name}`;
  }

  return events.map((event, index) => {
    if (index !== events.length - 1) {
      return `${event.destination.name} &mdash; `;
    }
    return event.destination.name;
  }).join(``);
};

const datesMarkup = (events) => {
  const dateFrom = events[0].dateFrom
    ? moment(events[0].dateFrom).format(`MMM DD`)
    : ``;
  const dateTo = events[events.length - 1]
    ? moment(events[events.length - 1].dateTo).format(`MMM DD`)
    : ``;

  return `<p class="trip-info__dates">${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}</p>`;
};

const costMarkup = (events) => {
  let sum = {price: 0};

  for (const event of events) {
    let cost = event.offers.reduce((acc, val) =>
      ({price: acc.price + val.price}), {price: event.price});

    sum.price += cost.price;
  }

  return sum.price;
};

export default class InfoView extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    if (!this._events.length) {
      return (
        `<section class="trip-main__trip-info  trip-info">
          <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
          </p>
        </section>`
      );
    }

    const sortedEventsByDate = this._events.sort((a, b) => a.dateFrom - b.dateFrom);

    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${destinationMarkup(sortedEventsByDate)}</h1>
          ${datesMarkup(sortedEventsByDate)}
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${costMarkup(sortedEventsByDate)}</span>
        </p>
      </section>`
    );
  }
}
