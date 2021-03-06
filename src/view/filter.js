import AbstractView from './abstract.js';

const createFilterItemMarkup = (filters, currentFilterType) => {
  return filters
    .map((filter) => {
      const {type, name, count} = filter;

      return (
        `<div class="trip-filters__filter">
          <input id="filter-${type}"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="${type}"
            ${type === currentFilterType ? `checked` : ``}
            ${!count ? `disabled` : ``}
          >
          <label class="trip-filters__filter-label" for="filter-${type}">
            ${name}
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

export default class FilterView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return (
      `<form class="trip-filters" action="#" method="get">
        ${createFilterItemMarkup(this._filters, this._currentFilterType)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    );
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
