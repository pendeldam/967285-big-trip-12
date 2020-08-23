import SortView from '../view/sort.js';
import DaysListView from '../view/days-list.js';
import DayView from '../view/day.js';
import NoEventsView from '../view/no-events.js';
import EventPresenter from './event.js';
import {render, remove} from '../utils/render.js';
import {SortType} from '../const.js';
import {updateEvent} from '../utils/event.js';

export default class Trip {
  constructor(container) {
    this._container = container;
    this._eventPresenter = {};
    this._dayListComponent = new DaysListView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();
    this._currentSortType = null;
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events, details, offers) {
    this._events = events.slice();
    this._details = details.slice();
    this._offers = offers.slice();

    if (!this._events.length) {
      this._renderNoEvents();
    } else {
      this._renderSort();
      this._sortEvents(SortType.DEFAULT);
      this._renderEvents();
    }
  }

  _handleEventChange(updatedEvent) {
    this._events = updateEvent(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent, this._details, this._offers);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderEvents() {
    render(this._container, this._dayListComponent);
    this._dayList = [];

    if (this._currentSortType !== SortType.DEFAULT) {
      this._renderDay(null, null);

    } else {

      const days = new Set(this._events.map((event) => event.dateFrom.toISOString().substring(0, 10)));

      [...days].forEach((day, index) => {
        this._renderDay(day, index);
      });
    }
  }

  _renderDay(day, index) {
    const dayComponent = new DayView(day, index);

    if (!day) {
      this._events.forEach((event) => {
        this._renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
      });

      this._dayList.push(dayComponent);

    } else {
      const eventsByDay = this._events.filter((event) => event.dateFrom.toISOString().substring(0, 10) === day);

      eventsByDay.forEach((event) => {
        this._renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
      });

      this._dayList.push(dayComponent);
    }

    render(this._dayListComponent, dayComponent);
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event, this._details, this._offers);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderNoEvents() {
    render(this._container, this._noEventsComponent);
  }

  _renderSort() {
    render(this._container, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this._events.sort((a, b) => a.dateFrom - b.dateFrom);
        break;
      case SortType.DURATION:
        this._events.sort((a, b) => b.duration - a.duration);
        break;
      case SortType.PRICE:
        this._events.sort((a, b) => b.price - a.price);
        break;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearDayList();
    this._renderEvents();
  }

  _clearDayList() {
    Object.values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._dayList.forEach((day) => remove(day));

    this._eventPresenter = {};
    this._dayList = [];
  }
}
