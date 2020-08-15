import InfoView from './view/info.js';
import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import DaysListView from './view/days-list.js';
import DayView from './view/day.js';
import EventView from './view/event.js';
import EventEditView from './view/event-edit.js';
import NoEventsView from './view/no-events.js';
import {generateEvents} from './mock/event.js';
import {render, replace} from './utils/render.js';

const TRIP_EVENTS_COUNT = 20;
const events = generateEvents(TRIP_EVENTS_COUNT);
const sortedEvents = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);
const days = new Set(sortedEvents.map((event) => event.dateFrom.toLocaleDateString()));

const headerMainEl = document.querySelector(`.trip-main`);
const headerControlsEl = headerMainEl.querySelector(`.trip-controls`);
const mainTripEventsEl = document.querySelector(`.trip-events`);

const renderEvent = (container, event) => {
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
};

render(headerMainEl, new InfoView(sortedEvents), `afterbegin`);
render(headerControlsEl.querySelector(`h2`), new SiteMenuView(), `afterend`);
render(headerControlsEl, new FilterView());

if (!events.length) {
  render(mainTripEventsEl, new NoEventsView());
} else {
  const dayListComponent = new DaysListView();
  render(mainTripEventsEl, new SortView());
  render(mainTripEventsEl, dayListComponent);

  [...days].forEach((day, index) => {
    const dayComponent = new DayView(day, index, events);

    render(dayListComponent, dayComponent);

    const eventsToday = events.filter((event) => event.dateFrom.toLocaleDateString() === day);

    eventsToday.forEach((event) => {
      renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
    });
  });
}
