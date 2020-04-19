import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import TaskEditorComponent from './components/task-editor.js';
import TaskComponent from './components/task.js';
import TasksComponent from './components/tasks.js';
import MenuComponent from './components/menu.js';
import SortComponent from './components/sort.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils.js';


const TASKS_COUNT = 20;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 4;


const renderTask = (taskListElement, task) => {

  const OnEditButtonClick = () => {
    taskListElement.replaceChild(taskEditorComponent.getElement(), taskComponent.getElement());
  };

  const OnEditFormSubmit = (evt) => {
    evt.preventDefault();
    taskListElement.replaceChild(taskComponent.getElement(), taskEditorComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);

  const taskEditorComponent = new TaskEditorComponent(task);
  const editForm = taskEditorComponent.getElement().querySelector(`form`);

  editButton.addEventListener(`click`, OnEditButtonClick);
  editForm.addEventListener(`click`, OnEditFormSubmit);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {

  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  tasks.slice(0, showingTasksCount).forEach((task) => {
    renderTask(taskListElement, task);
  });

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const previousTaskCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASK_COUNT_BY_BUTTON;

    tasks.slice(previousTaskCount, showingTasksCount).forEach((task) => {
      renderTask(taskListElement, task);
    });
    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
};

const tasks = generateTasks(TASKS_COUNT);
let showingTasksCountArray = tasks.slice(0, SHOWING_TASKS_COUNT_ON_START);
const filters = generateFilters(showingTasksCountArray);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new MenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

renderBoard(boardComponent, tasks);

export {tasks, SHOWING_TASKS_COUNT_ON_START};

