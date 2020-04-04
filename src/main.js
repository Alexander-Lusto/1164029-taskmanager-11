import {createMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardContainerTemplate} from './components/board-container.js';
import {createSortingTemplate} from './components/sorting.js';
import {createTaskEditorTemplate} from './components/task-editor.js';
import {createTaskTemplate} from './components/task.js';
import {createLoadButtonTemplate} from './components/load-button.js';

const TASKS_COUNT = 3;

// rendering elements

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const render = (container, element, place = `beforeend`) => {
  container.insertAdjacentHTML(place, element);
};

render(mainControl, createMenuTemplate());
render(main, createFilterTemplate());
render(main, createBoardContainerTemplate());

const board = main.querySelector(`.board`);
render(board, createSortingTemplate(), `afterbegin`);

const boardTasks = board.querySelector(`.board__tasks`);
render(boardTasks, createTaskEditorTemplate());

for (let i = 0; i < TASKS_COUNT; i++) {
  render(boardTasks, createTaskTemplate());
}

render(board, createLoadButtonTemplate());


