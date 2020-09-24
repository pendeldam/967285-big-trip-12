export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  DEFAULT: `event`,
  DURATION: `time`,
  PRICE: `price`
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
export const EVENT_DESTINATIONS = [`Paris`, `Amsterdam`, `Berlin`, `Prague`, `Rome`, `Barcelona`, `London`];

export const EVENT_OFFERS = [
  {
    title: `Business class`,
    price: 120
  }, {
    title: `Choose radio`,
    price: 60
  }, {
    title: `Add luggage`,
    price: 30
  }, {
    title: `Add meal`,
    price: 15
  }, {
    title: `Comfort class`,
    price: 100
  }, {
    title: `Book tickets`,
    price: 40
  }, {
    title: `Lunch in city`,
    price: 30
  }, {
    title: `Rent a car`,
    price: 200
  }, {
    title: `Comfort class`,
    price: 100
  }
];
