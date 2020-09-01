import EventEditView from '../view/event-edit.js';
import {generateId} from '../mock/event.js';
import {render, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class EventNew {
  constructor(container, changeData, detailsModel, offersModel) {
    this._container = container;
    this._changeData = changeData;
    this._detailsModel = detailsModel;
    this._offersModel = offersModel;
    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._eventEditComponent) {
      return;
    }

    this._eventEditComponent = new EventEditView(this._detailsModel, this._offersModel, true);
    this._eventEditComponent.setSubmitFormHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._container, this._eventEditComponent, `afterbegin`);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, event)
    );

    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
