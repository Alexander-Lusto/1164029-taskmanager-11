import LoadMoreButtonComponent from '../components/load-more-button.js';
import TaskEditorComponent from '../components/task-editor.js';
import TaskComponent from '../components/task.js';
import TasksComponent from '../components/tasks.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoTasksComponent from '../components/no-tasks.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 4;

const renderTask = (taskListElement, task) => {

  const replaceTaskToEdit = () => {
    replace(taskEditorComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditorComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `ESC`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  const taskEditorComponent = new TaskEditorComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditorComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
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
  constructor(container) {
    this._container = container;

    this._noTaskComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const previousTaskCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASK_COUNT_BY_BUTTON;
        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), previousTaskCount, showingTasksCount);
        renderTasks(taskListElement, sortedTasks);

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };


    const container = this._container.getElement();
    const isAllTaskArchieve = tasks.every((task) => task.isAllTaskArchieve);

    if (isAllTaskArchieve) {
      render(container, this._noTaskComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);
      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);
    });
  }
}
