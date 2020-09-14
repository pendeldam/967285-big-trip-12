import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {render, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {isEqual} from '../utils/event.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
  ABORTING: `ABORTING`
};

export const UpdateSwitch = {
  FULL: `FULL`,
  PARTIONAL: `PARTIONAL`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`
};

export default class Event {
  constructor(container, changeData, changeMode, detailsModel, offersModel) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._detailsMode = detailsModel;
    this._offersModel = offersModel;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._replaceEventToEdit = this._replaceEventToEdit.bind(this);
    this._replaceEventEditToEvent = this._replaceEventEditToEvent.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;

    this._eventComponent = new EventView(event);
    this._eventComponent.setEditClickHandler(this._handleEditClick);

    if (!prevEventComponent) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, this._eventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(this._eventEditComponent);
  }

  update(event) {
    this._event = event.object;
    switch (event.type) {
      case UpdateSwitch.FULL:
        this.init(event.object);
        break;
      case UpdateSwitch.PARTIONAL:
        event.change.call(this._eventEditComponent);
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEventEditToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceEventToEdit() {
    this._eventEditComponent = new EventEditView(this._detailsMode, this._offersModel, false, this._event);
    this._eventEditComponent.setSubmitFormHandler(this._handleFormSubmit);
    this._eventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEventEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeydownHandler);
    this._mode = Mode.DEFAULT;
    remove(this._eventEditComponent);
  }

  _escKeydownHandler(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._replaceEventEditToEvent();
    }
  }

  _handleEditClick() {
    this._replaceEventToEdit();
  }

  _handleFormSubmit(update) {
    const isMinorUpdate =
      !isEqual(this._event.price, update.price) ||
      !isEqual(this._event.dateFrom, update.dateFrom) ||
      !isEqual(this._event.dateTo, update.dateTo);

    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        {
          type: UpdateSwitch.FULL,
          object: update,
          change() {
            throw new Error(`Method restricted.`);
          }
        }
    );

    // this._replaceEventEditToEvent();
  }

  _handleFavoriteClick(value) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        {
          type: UpdateSwitch.PARTIONAL,
          object: Object.assign({}, this._event, {isFavorite: !this._event.isFavorite}),
          change() {
            this.toggleFavorite(value);
          }
        }
    );
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        {
          type: UpdateSwitch.FULL,
          object: event,
          change() {
            throw new Error(`Method restricted.`);
          }
        }
    );
  }
}
