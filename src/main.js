import {createMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardContainerTemplate} from './components/board-container.js';
import {createSortingTemplate} from './components/sorting.js';
import {createTaskEditorTemplate} from './components/task-editor.js';
import {createTaskTemplate} from './components/task.js';
import {createLoadButtonTemplate} from './components/load-button.js';
import {generateFilters} from './mock/filter.js';
import {generateTasks} from './mock/task.js';

const TASKS_COUNT = 20;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 4;

// rendering elements

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const render = (container, element, place = `beforeend`) => {
  container.insertAdjacentHTML(place, element);
};

render(mainControl, createMenuTemplate());

const tasks = generateTasks(TASKS_COUNT);
let showingTaskCountArray = tasks.slice(0, SHOWING_TASKS_COUNT_ON_START);
const filters = generateFilters(showingTaskCountArray);


render(main, createFilterTemplate(filters));
render(main, createBoardContainerTemplate());

const board = main.querySelector(`.board`);
render(board, createSortingTemplate(), `afterbegin`);

const boardTasks = board.querySelector(`.board__tasks`);
render(boardTasks, createTaskEditorTemplate(tasks[0]));

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTaskCount).forEach((task) => {
  render(boardTasks, createTaskTemplate(task));
});

render(board, createLoadButtonTemplate());

const loadMoreButton = document.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, () => {
  const previousTaskCount = showingTaskCount;
  showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTON;

  // заставляем фильтр реагировать на изменение карточек
  showingTaskCountArray = tasks.slice(0, showingTaskCount);
  const oldFilters = document.querySelector(`.filter`);
  oldFilters.remove();
  const newfilters = generateFilters(showingTaskCountArray);
  render(mainControl, createFilterTemplate(newfilters), `afterEnd`);

  tasks.slice(previousTaskCount, showingTaskCount).forEach((task) => {
    render(boardTasks, createTaskTemplate(task));
  });

  if (showingTaskCount >= tasks.length) {
    loadMoreButton.remove();
  }
});

export {tasks, SHOWING_TASKS_COUNT_ON_START};

