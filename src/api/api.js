import Event from "../models/event";
import Offers from "../models/offers";

const DEFAULT_HEADERS = {"Content-Type": `application/json`};
const URLS = [`destinations`, `offers`, `points`];

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const GoodStatus = {
  MIN: 200,
  MAX: 299
};

const checkStatus = (response) => {
  if (response.status >= GoodStatus.MIN && response.status <= GoodStatus.MAX) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getData() {
    const requests = URLS.map((url) => this._load({url}));
    return Promise.all(requests)
      .then((responses) => Promise.all(responses.map((response) => response.json())))
      .then((data) => {
        const [serverDestinations, offers, events] = data;
        const eventTypes = Offers.parse(offers);
        const destinations = serverDestinations.map((destination) => {
          return {
            destination: destination.name,
            destinationInfo: {
              description: destination.description,
              photos: destination.pictures
            }
          };
        });
        return [destinations, eventTypes, Event.parseEvents(events)];
      });
  }

  createEvent(newEvent) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(newEvent.toRaw()),
      headers: new Headers(DEFAULT_HEADERS)
    })
      .then((response) => response.json())
      .then(this._parseResponse);
  }

  updateEvent(id, newEvent) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(newEvent.toRaw()),
      headers: new Headers(DEFAULT_HEADERS)
    })
      .then((response) => response.json())
      .then(this._parseResponse);
  }

  deleteEvent(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  sync(events) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(events),
      headers: new Headers(DEFAULT_HEADERS)
    })
      .then((response) => response.json());
  }

  _parseResponse(event) {
    return Event.parseEvent(event);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
