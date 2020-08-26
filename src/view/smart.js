import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method is not implemented: restoreHandlers`);
  }

  updateData(update, justDataUpdate) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {}, this._data, update
    );

    if (justDataUpdate) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }
}
