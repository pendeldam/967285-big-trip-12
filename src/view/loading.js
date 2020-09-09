import Abstarct from './abstract.js';

export default class Loading extends Abstarct {
  getTemplate() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }
}
