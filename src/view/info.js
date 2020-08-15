import AbstractView from './abstract.js';

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
  const dateFrom = events[0].dateFrom.toLocaleDateString(`en-US`, {month: `short`, day: `2-digit`});
  const dateTo = events[events.length - 1].dateTo.toLocaleDateString(`en-US`, {month: `short`, day: `2-digit`});

  return `<p class="trip-info__dates">${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}</p>`;
};

const costMarkup = (events) => {
  let result = 0;

  for (const event of events) {
    if (event.offers !== null) {
      const cost = event.offers.reduce((acc, val) => ({price: acc.price + val.price}));
      result += event.price + cost.price;
    } else {
      result += event.price;
    }
  }
  return result;
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
    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${destinationMarkup(this._events)}</h1>
          ${datesMarkup(this._events)}
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${costMarkup(this._events)}</span>
        </p>
      </section>`
    );
  }
}
