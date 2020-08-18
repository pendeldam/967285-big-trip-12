import InfoView from './view/info.js';
import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import TripPresenter from './presenter/trip.js';
import {generateEvents} from './mock/event.js';
import {render} from './utils/render.js';

const TRIP_EVENTS_COUNT = 20;
const events = generateEvents(TRIP_EVENTS_COUNT);
const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainTripEventsEl = document.querySelector(`.trip-events`);

render(headerMainEl, new InfoView(events), `afterbegin`);
render(headerControlsEl.querySelector(`h2`), new SiteMenuView(), `afterend`);
render(headerControlsEl, new FilterView());

const tripPresenter = new TripPresenter(mainTripEventsEl);
tripPresenter.init(events);
