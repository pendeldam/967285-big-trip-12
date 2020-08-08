import {createTripInfoMarkup} from './view/info.js';
import {createSiteMenuMarkup} from './view/site-menu.js';
import {createTripFiltersMarkup} from './view/filter.js';
import {createTripSortMarkup} from './view/sort.js';
import {createTripDaysMarkup} from './view/days-list.js';
import {createNoEventsMarkup} from './view/no-events.js';
import {generateEvents} from './mock/event.js';

const TRIP_EVENTS_COUNT = 20;
const events = generateEvents(TRIP_EVENTS_COUNT);
const sortedEvents = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);
const days = new Set(sortedEvents.map((event) => event.dateFrom.toLocaleDateString()));

const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainTripEventsEl = document.querySelector(`.trip-events`);

const render = (container, element, location) => {
  container.insertAdjacentHTML(location, element);
};

render(headerMainEl, createTripInfoMarkup(sortedEvents), `afterbegin`);
render(headerControlsEl.querySelector(`h2`), createSiteMenuMarkup(), `afterend`);
render(headerControlsEl, createTripFiltersMarkup(), `beforeend`);

if (!events.length) {
  render(mainTripEventsEl, createNoEventsMarkup(), `beforeend`);
} else {
  render(mainTripEventsEl, createTripSortMarkup(), `beforeend`);
  render(mainTripEventsEl, createTripDaysMarkup(days, sortedEvents), `beforeend`);
}
