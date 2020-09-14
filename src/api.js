import EventsModel from './model/events.js';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: `points`})
    .then(Api.toJSON)
    .then((events) => events.map(EventsModel.adaptToClient));
  }

  getDetails() {
    return this._load({url: `destinations`})
      .then(Api.toJSON)
      .then((details) => new Map(details.map((it) => [it.name, it])));
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON)
      .then((offers) => new Map(offers.map((it) => [it.type, it])));
  }

  addEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({"Content-type": `application/json`})
    })
    .then(Api.toJSON)
    .then(EventsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load({
      url: `points/${event.object.id}`,
      method: Method.DELETE
    });
  }

  updateEvent(update) {
    return this._load({
      url: `points/${update.object.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(update.object)),
      headers: new Headers({"Content-type": `application/json`})
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(error) {
    throw error;
  }
}
