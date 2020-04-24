import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import MenuComponent from './components/menu.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';
import BoardController from './controlers/board.js';


const TASKS_COUNT = 40;
const SHOWING_TASKS_COUNT_ON_START = 8;

const tasks = generateTasks(TASKS_COUNT);
let showingTasksCountArray = tasks.slice(0, SHOWING_TASKS_COUNT_ON_START);
const filters = generateFilters(showingTasksCountArray);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new MenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);

