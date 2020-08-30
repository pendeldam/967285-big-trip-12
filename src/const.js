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
  MAJOR: `MAJOR`
};

export const EVENT_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
export const EVENT_DESTINATIONS = [`Paris`, `Amsterdam`, `Berlin`, `Prague`, `Rome`, `Barcelona`, `London`];
export const EVENT_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                  Cras aliquet varius magna, non porta ligula feugiat eget.
                                  Fusce tristique felis at fermentum pharetra.
                                  Aliquam id orci ut lectus varius viverra.
                                  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
                                  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
                                  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
                                  Sed sed nisi sed augue convallis suscipit in sed felis.
                                  Aliquam erat volutpat.
                                  Nunc fermentum tortor ac porta dapibus.
                                  In rutrum ac purus sit amet tempus.`;

export const EVENT_OFFERS = [
  {
    id: `business`,
    title: `Business class`,
    price: 120
  }, {
    id: `radio`,
    title: `Choose radio`,
    price: 60
  }, {
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `comfort`,
    title: `Comfort class`,
    price: 100
  }, {
    id: `tickets`,
    title: `Book tickets`,
    price: 40
  }, {
    id: `lunch`,
    title: `Lunch in city`,
    price: 30
  }, {
    id: `car`,
    title: `Rent a car`,
    price: 200
  }, {
    id: `comfort`,
    title: `Comfort class`,
    price: 100
  }
];
