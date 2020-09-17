import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
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
const newEventButton = headerMainEl.querySelector(`.trip-main__event-add-btn`);
const mainEl = document.querySelector(`.trip-events`);

const AUTHORIZATION = `Basic 809hfd21mnv376lk123xz`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filterModel = new FilterModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const detailsModel = new DetailsModel();
const siteMenuComponent = new SiteMenuView();
const infoPresenter = new InfoPresenter(headerMainEl, eventsModel);
const tripPresenter = new TripPresenter(mainEl, eventsModel, detailsModel, offersModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(headerControlsEl, filterModel, eventsModel);

let statsComponent = null;

const handleNewEventFormClose = () => {
  newEventButton.disabled = false;
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

newEventButton.addEventListener(`click`, (evt) => {
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
tripPresenter.init();

apiWithProvider.getDetails()
  .then((details) => {
    detailsModel.setDetails(details);
    return apiWithProvider.getOffers();
  })
  .then((offers) => {
    offersModel.setOffers(offers);
    apiWithProvider.getEvents()
      .then((events) => eventsModel.setEvents(UpdateType.INIT, events))
      .catch(() => eventsModel.setEvents(UpdateType.INIT, []))
      .finally(() => {
        render(headerControlsEl.querySelector(`h2`), siteMenuComponent, `afterend`);
        siteMenuComponent.setSiteMenuClickHandler(handleSiteMenuClick);
        filterPresenter.init();
      });
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    newEventButton.disabled = true;
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
