import SiteMenuView from './view/site-menu.js';
import FilterModel from './model/filter.js';
import EventsModel from './model/events.js';
import OffersModel from './model/offers.js';
import DetailsModel from './model/details.js';
import InfoPresenter from './presenter/info.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import StatsView from './view/stats.js';
import {generateEvents} from './mock/event.js';
import {details} from './mock/details.js';
import {options} from './mock/offer.js';
import {render} from './utils/render.js';

const TRIP_EVENTS_COUNT = 20;
const events = generateEvents(TRIP_EVENTS_COUNT);

const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainEl = document.querySelector(`.trip-events`);

const filterModel = new FilterModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const detailsModel = new DetailsModel();

eventsModel.setEvents(events);
offersModel.setOffers(options);
detailsModel.setDetails(details);

const siteMenuComponent = new SiteMenuView();

render(headerControlsEl.querySelector(`h2`), siteMenuComponent, `afterend`);

const infoPresenter = new InfoPresenter(headerMainEl, eventsModel);
const tripPresenter = new TripPresenter(mainEl, eventsModel, detailsModel, offersModel, filterModel);
const filterPresenter = new FilterPresenter(headerControlsEl, filterModel);

const statsComponent = new StatsView(eventsModel.getEvents());
render(mainEl, statsComponent);

infoPresenter.init();
filterPresenter.init();
tripPresenter.init();

headerMainEl
  .querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });
