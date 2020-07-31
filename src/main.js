import {createTripInfoMarkup} from './view/info.js';
import {createSiteMenuMarkup} from './view/site-menu.js';
import {createTripFiltersMarkup} from './view/filter.js';
import {createTripSortMarkup} from './view/sort.js';
import {createTripDaysMarkup} from './view/days.js';
import {createTripDayMarkup} from './view/day.js';
import {createTripEventMarkup} from './view/event.js';
import {createTripEventEditMarkup} from './view/event-edit.js';

const EVENTS_COUNT = 3;
const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainTripEventsEl = document.querySelector(`.trip-events`);

const render = (container, element, location) => {
  container.insertAdjacentHTML(location, element);
};

render(headerMainEl, createTripInfoMarkup(), `afterbegin`);
render(headerControlsEl.querySelector(`h2`), createSiteMenuMarkup(), `afterend`);
render(headerControlsEl, createTripFiltersMarkup(), `beforeend`);
render(mainTripEventsEl.querySelector(`h2`), createTripSortMarkup(), `afterend`);
render(mainTripEventsEl, createTripDaysMarkup(), `beforeend`);
render(mainTripEventsEl.querySelector(`.trip-days`), createTripDayMarkup(), `beforeend`);

const eventListEl = mainTripEventsEl.querySelector(`.trip-events__list`);

render(eventListEl, createTripEventEditMarkup(), `beforeend`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(eventListEl, createTripEventMarkup(), `beforeend`);
}
