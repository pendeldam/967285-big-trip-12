import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

export default class SiteMenuView extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn  trip-tabs__btn--active" data-title=${MenuItem.TABLE} href="#">${MenuItem.TABLE}</a>
        <a class="trip-tabs__btn" data-title=${MenuItem.STATS} href="#">${MenuItem.STATS}</a>
      </nav>`
    );
  }

  setSiteMenuClickHandler(callback) {
    this._callback.menuClickHandler = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClickHandler(evt.target.textContent);
  }

  setMenuItem(enableItem, disableItem) {
    this.getElement().querySelector(`[data-title=${enableItem}]`).classList.add(`trip-tabs__btn--active`);
    this.getElement().querySelector(`[data-title=${disableItem}]`).classList.remove(`trip-tabs__btn--active`);
  }
}
