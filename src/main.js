import EventsModel from './model/events.js';
import OffersModel from './model/offers.js';
import DetailsModel from './model/details.js';
import InfoView from './view/info.js';
import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import TripPresenter from './presenter/trip.js';
import {generateEvents} from './mock/event.js';
import {generateDetails} from './mock/description.js';
import {generateOffers} from './mock/offer.js';
import {render} from './utils/render.js';

const details = generateDetails();
export const offers = generateOffers();

const TRIP_EVENTS_COUNT = 20;
const events = generateEvents(TRIP_EVENTS_COUNT);

const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainTripEventsEl = document.querySelector(`.trip-events`);

const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const detailsModel = new DetailsModel();

eventsModel.setEvents(events);
offersModel.setOffers(offers);
detailsModel.setDetails(details);

render(headerMainEl, new InfoView(events), `afterbegin`);
render(headerControlsEl.querySelector(`h2`), new SiteMenuView(), `afterend`);
render(headerControlsEl, new FilterView());

const tripPresenter = new TripPresenter(mainTripEventsEl, eventsModel, detailsModel, offersModel);
tripPresenter.init();
