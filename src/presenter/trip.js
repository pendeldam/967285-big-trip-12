import SortView from '../view/sort.js';
import DaysListView from '../view/days-list.js';
import DayView from '../view/day.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import NoEventsView from '../view/no-events.js';
import {render, replace} from '../utils/render.js';

export default class Trip {
  constructor(container) {
    this._container = container;
    this._dayListComponent = new DaysListView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();
    this._currentSortType = null;
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();

    if (!this._events.length) {
      this._renderNoEvents();
    } else {
      this._renderSort();
      this._sortEvents(`sort-event`);
      this._renderEvents();
    }
  }

  _renderEvents() {
    render(this._container, this._dayListComponent);

    if (this._currentSortType !== `sort-event`) {
      this._renderDay(null, null, 0);

    } else {

      const days = new Set(this._events.map((event) => event.dateFrom.toISOString().substring(0, 10)));

      [...days].forEach((day, index) => {
        this._renderDay(day, index, this._events);
      });
    }
  }

  _renderDay(day, index) {
    const dayComponent = new DayView(day, index);

    render(this._dayListComponent, dayComponent);

    if (!day) {
      this._events.forEach((event) => {
        this._renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
      });

    } else {
      const eventsByDay = this._events.filter((event) => event.dateFrom.toISOString().substring(0, 10) === day);

      eventsByDay.forEach((event) => {
        this._renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
      });
    }
  }

  _renderEvent(container, event) {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EventEditView(event);

    const replaceEventToEdit = () => {
      replace(eventEditComponent, eventComponent);
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const replaceEventEditToEvent = () => {
      replace(eventComponent, eventEditComponent);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (evt) => {
      const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

      if (isEscKey) {
        evt.preventDefault();
        replaceEventEditToEvent();
      }
    };

    eventComponent.setEditClickHandler(() => {
      replaceEventToEdit();
    });

    eventEditComponent.setSubmitFormHandler(() => {
      replaceEventEditToEvent();
    });

    render(container, eventComponent);
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
      case `sort-event`:
        this._events.sort((a, b) => a.dateFrom - b.dateFrom);
        break;
      case `sort-time`:
        this._events.sort((a, b) => b.duration - a.duration);
        break;
      case `sort-price`:
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
    this._dayListComponent.getElement().innerHTML = ``;
  }
}
