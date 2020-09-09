import Api from './api.js';
import SiteMenuView from './view/site-menu.js';
import FilterModel from './model/filter.js';
import EventsModel from './model/events.js';
import OffersModel from './model/offers.js';
import DetailsModel from './model/details.js';
import InfoPresenter from './presenter/info.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import StatsView from './view/stats.js';
import {render, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './const.js';

const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainEl = document.querySelector(`.trip-events`);

const AUTHORIZATION = `Basic 809hfd21mnv376lk`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);

api.getEvents()
  .then((events) => eventsModel.setEvents(UpdateType.INIT, events))
  .catch(() => eventsModel.setEvents(UpdateType.INIT, []));

api.getDetails()
  .then((details) => detailsModel.setDetails(details))
  .catch(() => detailsModel.setDetails([]));

api.getOffers()
  .then((offers) => offersModel.setOffers(offers))
  .catch(() => offersModel.setOffers([]));

const filterModel = new FilterModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const detailsModel = new DetailsModel();

const siteMenuComponent = new SiteMenuView();

render(headerControlsEl.querySelector(`h2`), siteMenuComponent, `afterend`);

const infoPresenter = new InfoPresenter(headerMainEl, eventsModel);
const tripPresenter = new TripPresenter(mainEl, eventsModel, detailsModel, offersModel, filterModel, api);
const filterPresenter = new FilterPresenter(headerControlsEl, filterModel);

let statsComponent = null;

const handleNewEventFormClose = () => {
  headerMainEl.querySelector(`.trip-main__event-add-btn`).disabled = false;
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      remove(statsComponent);
      tripPresenter.init();

      siteMenuComponent.setMenuItem(MenuItem.TABLE, MenuItem.STATS);
      break;
    case MenuItem.STATS:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      statsComponent = new StatsView(eventsModel.getEvents());
      render(mainEl, statsComponent);

      siteMenuComponent.setMenuItem(MenuItem.STATS, MenuItem.TABLE);
      break;
  }
};

siteMenuComponent.setSiteMenuClickHandler(handleSiteMenuClick);

headerMainEl
  .querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;

    if (statsComponent !== null) {
      remove(statsComponent);
    }

    tripPresenter.destroy();
    filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    tripPresenter.init();
    tripPresenter.createEvent(handleNewEventFormClose);

    siteMenuComponent.setMenuItem(MenuItem.TABLE, MenuItem.STATS);
  });

infoPresenter.init();
filterPresenter.init();
tripPresenter.init();
