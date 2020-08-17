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
  }

  init(events) {
    this._events = events.slice();

    if (!this._events.length) {
      this._renderNoEvents();
    } else {
      this._renderSort();
      this._renderDayList(this._events);
    }
  }

  _renderDayList(events) {
    const sortedEventsByDate = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);
    const days = new Set(sortedEventsByDate.map((event) => event.dateFrom.toLocaleDateString()));

    render(this._container, this._dayListComponent);

    [...days].forEach((day, index) => {
      this._renderDay(day, index, sortedEventsByDate);
    });
  }

  _renderDay(day, index, events) {
    const dayComponent = new DayView(day, index, events);

    render(this._dayListComponent, dayComponent);

    const eventsToday = events.filter((event) => event.dateFrom.toLocaleDateString() === day);

    eventsToday.forEach((event) => {
      this._renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
    });

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
  }
}
