import LoadMoreButtonComponent from '../components/load-more-button.js';
import TaskController from './task.js';
import TasksComponent from '../components/tasks.js';
import SortComponent from '../components/sort.js';
import NoTasksComponent from '../components/no-tasks.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {SortType} from '../const.js';
import {Mode as TaskControllerMode, EmptyTask} from './task.js';


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 4;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {

  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task, TaskControllerMode.DEFAULT);
    return taskController;
  });

};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTask = tasks.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedTasks = showingTask;
      break;

    case SortType.DATE_UP:
      sortedTasks = showingTask.sort((a, b) => a.dueDate - b.dueDate);
      break;

    case SortType.DATE_DOWN:
      sortedTasks = showingTask.sort((a, b) => b.dueDate - a.dueDate);
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container, tasksModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._api = api;

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTaskComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
    this._creatingTask = null;
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  render() {
    const tasks = this._tasksModel.getTasks();

    const container = this._container.getElement();
    const isAllTaskArchieve = tasks.every((task) => task.isAllTaskArchieve);

    if (isAllTaskArchieve) {
      render(container, this._noTaskComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const previousTaskCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASK_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), previousTaskCount, this._showingTasksCount);
    this._renderTasks(sortedTasks);

    if (this._showingTasksCount >= sortedTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);
    this._removeTasks();
    this._renderTasks(sortedTasks);
    this._renderLoadMoreButton();
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) { // если стархы данных нет тогда : (добавление задачи)
      this._creatingTask = null; // заводим флаг "процесс создания задачи" - т.е. открыта ли форма создания задачи или нет (нет - ull, lf - форма задачи)
      if (newData === null) { // если нет новых данных - тогда удаление новой задачи;
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else { // в обратном случае - создаем новую задачу
        this._tasksModel.addTask(newData); // добавляем карточку в модель данных
        taskController.render(newData, TaskControllerMode.DEFAULT);

        if (this._showingTasksCount % SHOWING_TASK_COUNT_BY_BUTTON === 0) { // проверяем не превысили ли мы лимит по количеству отображаемых карточек
          const destroedTask = this._showedTaskControllers.pop(); // если карточек больше чем может быть на экране (8), то удаляем лишнюю
          destroedTask.destroy();

        }

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTaskCount = this._showedTaskControllers.length; // обновляем количество карточек

        this._renderLoadMoreButton();
      }

    } else if (newData === null) { // если новых данных нет, тогда: (удаление)
      this._tasksModel.removeTask(oldData.id); // удаляем старые данные
      this._updateTasks(this._showingTasksCount); // перерисоваем отображение view
    } else { // если есть и старые и новые данные: (обновление)
      this._api.updateTask(oldData.id, newData)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel); // пробуем обновить данные

          if (isSuccess) { // если данные обновились, обновляем view - отображение
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
            this._updateTasks(this._showingTasksCount);
          }
        });

    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }
}
