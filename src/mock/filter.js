const FILTER_NAMES = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archieve`];

const generateFilters = (tasksArray) => {
  return FILTER_NAMES.map((it, i) => {
    return {
      name: it,
      count: calculateCount(FILTER_NAMES[i], tasksArray),
    };
  });
};

const calculateCount = (filterName, tasksArray) => {
  let count;
  const date = new Date();

  switch (filterName) {
    case `all`:
      count = tasksArray.length - tasksArray.filter((it) => it.isArchieve === true).length;
      break;
    case `overdue`:
      count = tasksArray.filter((it) => it.dueDate instanceof Date && it.dueDate < date).length;
      break;
    case `today`:
      count = tasksArray.filter((it) => it.dueDate instanceof Date && it.dueDate.getDate() === date.getDate()).length;
      break;
    case `favorites`:
      count = tasksArray.filter((it) => it.isFavorite === true).length;
      break;
    case `repeating`:
      count = tasksArray.filter((it) => Object.values(it.repeatingDays).some(Boolean)).length;
      break;
    case `archieve`:
      count = tasksArray.filter((it) => it.isArchieve === true).length;
      break;
  }
  return count;
};

export {generateFilters};
