import SiteMenuView from './view/site-menu.js';
import FilterModel from './model/filter.js';
import EventsModel from './model/events.js';
import OffersModel from './model/offers.js';
import DetailsModel from './model/details.js';
import InfoPresenter from './presenter/info.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import {generateEvents} from './mock/event.js';
import {generateDetails} from './mock/description.js';
import {generateOffers} from './mock/offer.js';
import {render} from './utils/render.js';

export const details = generateDetails();
export const offers = generateOffers();

const TRIP_EVENTS_COUNT = 5;
const events = generateEvents(TRIP_EVENTS_COUNT);

const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainTripEventsEl = document.querySelector(`.trip-events`);

const filterModel = new FilterModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const detailsModel = new DetailsModel();

eventsModel.setEvents(events);
offersModel.setOffers(offers);
detailsModel.setDetails(details);

render(headerControlsEl.querySelector(`h2`), new SiteMenuView(), `afterend`);

const infoPresenter = new InfoPresenter(headerMainEl, eventsModel);
const tripPresenter = new TripPresenter(mainTripEventsEl, eventsModel, detailsModel, offersModel, filterModel);
const filterPresenter = new FilterPresenter(headerControlsEl, filterModel);

infoPresenter.init();
filterPresenter.init();
tripPresenter.init();

headerMainEl
  .querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });
