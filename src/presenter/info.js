import InfoView from '../view/info.js';
import {render, replace, remove} from '../utils/render.js';

export default class Info {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._infoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevInfoComponent = this._infoComponent;
    const events = this._eventsModel.getEvents().slice();

    this._infoComponent = new InfoView(events);

    if (!prevInfoComponent) {
      render(this._container, this._infoComponent, `afterbegin`);
      return;
    }

    replace(this._infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
