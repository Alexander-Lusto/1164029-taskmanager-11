import {FilterType} from '../const.js';
import {getTasksByFilter} from '../utils/filter.js'
import FilterComponent from '../components/filter.js';
import {replace, RenderPosition} from '../utils/render.js';

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._taskModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._taskModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allTasks = this._taskModel.getTasks();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      this.render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
