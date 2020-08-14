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
import {render} from './utils.js';

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
    container.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
    document.addEventListener(`keydown`, onEscKeydown);
  };

  const replaceEventEditToEvent = () => {
    container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeydown);
  };

  const onEscKeydown = (evt) => {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      evt.preventDefault();
      replaceEventEditToEvent();
    }
  };

  eventComponent.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      replaceEventToEdit();
    });

  eventEditComponent.getElement()
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceEventEditToEvent();
    });

  render(container, eventComponent.getElement());
};

render(headerMainEl, new InfoView(sortedEvents).getElement(), `afterbegin`);
render(headerControlsEl.querySelector(`h2`), new SiteMenuView().getElement(), `afterend`);
render(headerControlsEl, new FilterView().getElement());

if (!events.length) {
  render(mainTripEventsEl, new NoEventsView().getElement());
} else {
  const dayListComponent = new DaysListView();
  render(mainTripEventsEl, new SortView().getElement());
  render(mainTripEventsEl, dayListComponent.getElement());

  [...days].forEach((day, index) => {
    const dayComponent = new DayView(day, index, events);

    render(dayListComponent.getElement(), dayComponent.getElement());

    const eventsToday = events.filter((event) => event.dateFrom.toLocaleDateString() === day);

    eventsToday.forEach((event) => {
      renderEvent(dayComponent.getElement().querySelector(`.trip-events__list`), event);
    });
  });
}
