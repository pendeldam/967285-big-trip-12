import FilterView from '../view/filter.js';
import {render, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType} from '../const.js';

export default class Filter {
  constructor(container, filterModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._currentFilter = null;
    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(this._getFilters(), this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (!prevFilterComponent) {
      render(this._container, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: `Everything`
      },
      {
        type: FilterType.FUTURE,
        name: `Future`
      },
      {
        type: FilterType.PAST,
        name: `Past`
      }
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
