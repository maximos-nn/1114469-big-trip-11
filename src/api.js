import {Event} from "./models/event";
import {Offers} from "./models/offers";
import {Store} from "./store";

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

export class API {
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
        const eventTypes = Offers.parseOffers(offers);
        const destinations = serverDestinations.map((destination) => {
          return {
            destination: destination.name,
            destinationInfo: {
              description: destination.description,
              photos: destination.pictures
            }
          };
        });
        Store.setDestinations(destinations);
        Store.setEventTypes(eventTypes);
        return [destinations, eventTypes, Event.parseEvents(events, eventTypes)];
      });
  }

  updateEvent(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((event) => Event.parseEvent(event, Store.eventTypes));
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
