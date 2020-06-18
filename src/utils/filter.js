import {isOneDay, isOverdueDate, isRepeating} from '../utils/common.js';
import {FilterType} from '../const.js';

export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getFavoritesTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

export const getTasksByFilter = (tasks, filterType) => {
  const date = new Date();

  switch (filterType) {

    case FilterType.ALL:
      return getNotArchiveTasks(tasks);

    case FilterType.Archive:
      return getArchiveTasks(tasks);

    case FilterType.FAVORITES:
      return getFavoritesTasks(getNotArchiveTasks(tasks));

    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), date);

    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));

    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), date);

  }

  return tasks;
};
