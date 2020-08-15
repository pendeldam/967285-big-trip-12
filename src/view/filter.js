import AbstractView from './abstract.js';

const createFilterItemMarkup = (filters) => {
  return filters
    .map((filter, index) => {
      return (
        `<div class="trip-filters__filter">
          <input id="filter-${filter.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.toLowerCase()}" ${index === 0 ? `checked` : ``}>
          <label class="trip-filters__filter-label" for="filter-${filter.toLowerCase()}">${filter}</label>
        </div>`
      );
    })
    .join(`\n`);
};

export default class FilterView extends AbstractView {
  getTemplate() {
    const filters = [`Everything`, `Future`, `Past`];

    return (
      `<form class="trip-filters" action="#" method="get">
        ${createFilterItemMarkup(filters)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    );
  }
}
