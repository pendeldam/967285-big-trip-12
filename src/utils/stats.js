import moment from 'moment';

export const getCostByTypes = (events) => {
  return [...new Set(events.map((event) => event.type))]
    .map((type) => {
      const eventsByType = events.filter((event) => event.type === type);
      const sum = eventsByType.reduce((acc, val) => ({price: acc.price + val.price}));
      return [type, sum.price];
    })
    .sort(([, priceA], [, priceB]) => priceB - priceA);
};

export const countTransportUsage = (events) => {
  const types = [`flight`, `taxi`, `bus`, `train`, `ship`, `transport`, `drive`];

  return types
    .map((type) => {
      return [type, events.filter((event) => event.type === type).length];
    })
    .sort(([, countA], [, countB]) => countB - countA);
};

export const getTimeByTypes = (events) => {
  return [...new Set(events.map((event) => event.type))]
    .map((type) => {
      const eventsByType = events.filter((event) => event.type === type);
      const sum = eventsByType.reduce((acc, val) => (moment(acc) + moment(val.dateFrom).diff(val.dateTo)), 0);
      return [type, Math.ceil(moment.duration(sum).asHours()).toString().replace(`-`, ``)];
    })
    .sort(([, durationA], [, durationB]) => durationB - durationA);
};
