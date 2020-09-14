import SortView from '../view/sort.js';
import DaysListView from '../view/days-list.js';
import DayView from '../view/day.js';
import NoEventsView from '../view/no-events.js';
import LoadingView from '../view/loading.js';
import EventPresenter, {State as EventPresenterViewState, UpdateSwitch} from './event.js';
import EventNewPresenter from './event-new.js';
import {render, remove} from '../utils/render.js';
import {sortByTime, sortByPrice, sortByDefault} from '../utils/event.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(container, eventsModel, detailsModel, offersModel, filterModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._detailsModel = detailsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._api = api;
    this._eventPresenter = {};
    this._dayList = [];
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._isDataAvailable = true;

    this._dayListComponent = new DaysListView();
    this._loadingComponent = new LoadingView();
    this._sortComponent = null;
    this._noEventsComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._dayListComponent, this._handleViewAction, this._detailsModel, this._offersModel);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderTrip();
  }

  destroy() {
    this._clearTrip(true);
    remove(this._dayListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (!this._eventsModel.getEvents().length) {
      remove(this._noEventsComponent);
      render(this._container, this._dayListComponent);
    }

    this._eventNewPresenter.init(callback);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DURATION:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
    }

    return filteredEvents.sort(sortByDefault);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        if (update.type === UpdateSwitch.FULL) {
          this._eventPresenter[update.object.id].setViewState(EventPresenterViewState.SAVING);
        }

        this._api.updateEvent(update)
          .then(() => this._eventsModel.updateEvent(updateType, update))
          .catch(() => this._eventPresenter[update.object.id].setViewState(EventPresenterViewState.ABORTING));
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => this._eventsModel.addEvent(updateType, response))
          .catch(() => this._eventNewPresenter.setAborting());
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.object.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => this._eventsModel.deleteEvent(updateType, update))
          .catch(() => this._eventPresenter[update.object.id].setViewState(EventPresenterViewState.ABORTING));
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.object.id].update(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
      case UpdateType.INIT:
        if (!this._detailsModel.getDetails() || !this._offersModel.getOffers()) {
          this._isDataAvailable = false;
        }

        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getEvents().length || !this._isDataAvailable) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._renderEvents();
  }

  _renderEvents() {
    render(this._container, this._dayListComponent);

    if (this._currentSortType !== SortType.DEFAULT) {
      this._renderDay(null, null);

    } else {

      const days = new Set(this._getEvents().map((event) => event.dateFrom.toISOString().substring(0, 10)));

      [...days].forEach((day, index) => {
        this._renderDay(day, index);
      });
    }
  }

  _renderDay(day, index) {
    const dayComponent = new DayView(day, index);

    if (!day) {
      this._getEvents().forEach((event) => {
        this._renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
      });

      this._dayList.push(dayComponent);

    } else {
      const eventsByDay = this._getEvents().filter((event) => event.dateFrom.toISOString().substring(0, 10) === day);

      eventsByDay.forEach((event) => {
        this._renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
      });

      this._dayList.push(dayComponent);
    }

    render(this._dayListComponent, dayComponent);
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._handleViewAction, this._handleModeChange, this._detailsModel, this._offersModel);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderNoEvents() {
    this._noEventsComponent = new NoEventsView(this._isDataAvailable);
    render(this._container, this._noEventsComponent);
  }

  _renderLoading() {
    render(this._container, this._loadingComponent);
  }

  _renderSort() {
    if (!this._sortComponent) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType, SortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._container, this._sortComponent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _clearTrip(resetSortType = false) {
    this._eventNewPresenter.destroy();

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    if (this._dayList.length) {
      this._dayList.forEach((day) => remove(day));
    }

    Object.values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};
    this._dayList = [];

    remove(this._sortComponent);
    remove(this._noEventsComponent);
    remove(this._loadingComponent);
  }
}
