import AbstractView from './abstract.js';

export default class DayListView extends AbstractView {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
