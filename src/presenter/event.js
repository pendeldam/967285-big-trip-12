import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {render, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Event {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._Mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._replaceEventToEdit = this._replaceEventToEdit.bind(this);
    this._replaceEventEditToEvent = this._replaceEventEditToEvent.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event, details, offers) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(event);
    this._eventEditComponent = new EventEditView(event, details, offers);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setSubmitFormHandler(this._handleFormSubmit);
    this._eventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (!prevEventComponent || !prevEventEditComponent) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._container.contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._container.contains(prevEventEditComponent.getElement())) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView() {
    if (this._Mode !== Mode.DEFAULT) {
      this._replaceEventEditToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeydownHandler);
    this._changeMode();
    this._Mode = Mode.EDITING;
  }

  _replaceEventEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeydownHandler);
    this._Mode = Mode.DEFAULT;
  }

  _escKeydownHandler(evt) {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._replaceEventEditToEvent();
    }
  }

  _handleEditClick() {
    this._replaceEventToEdit();
  }

  _handleFormSubmit(event) {
    this._changeData(event);
    this._replaceEventEditToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign(
        {}, this._event, {isFavorite: !this._event.isFavorite}));
  }
}
