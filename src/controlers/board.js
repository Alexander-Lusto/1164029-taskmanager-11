import LoadMoreButtonComponent from '../components/load-more-button.js';
import TaskEditorComponent from '../components/task-editor.js';
import TaskComponent from '../components/task.js';
import TasksComponent from '../components/tasks.js';
import SortComponent from '../components/sort.js';
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

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTaskComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTaskArchieve = tasks.every((task) => task.isAllTaskArchieve);

    if (isAllTaskArchieve) {
      render(container, new NoTasksComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, new SortComponent(), RenderPosition.BEFOREEND);
    render(container, new TasksComponent(), RenderPosition.BEFOREEND);

    const taskListElement = container.querySelector(`.board__tasks`);
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    tasks.slice(0, showingTasksCount).forEach((task) => {
      renderTask(taskListElement, task);
    });

    const loadMoreButtonComponent = new LoadMoreButtonComponent();
    render(container, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      const previousTaskCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASK_COUNT_BY_BUTTON;

      tasks.slice(previousTaskCount, showingTasksCount).forEach((task) => {
        renderTask(taskListElement, task);
      });

      if (showingTasksCount >= tasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
}
