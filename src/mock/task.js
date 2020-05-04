import {COLORS, WeekDay} from '../const.js';

const DescriptionItems = [
  `Покормить кота`,
  `Поиграть в Rezident Evil`,
  `Позвонить Серёге`,
  `Прочитать "Мартен Иден"`,
  `Уйти с работы пораньше`,
  `Пожать сотку`,
  `Убраться в комнате`,
  `Сделать английский`,
  `Купить плюшевого Тоторо`,
  `Научться готовить что-то съедобное`,
  `Написать письмо тёте`,
  `Пересмотреть "По ту сторону изгороди"`,
  `Похудеть к лету`,
  `Написать нормальное резюме`,
  `Накачать пресс`,
  `Полить кактус`,
  `Напиться с незнакомцем в баре`,
  `Научиться вставать в 6 утра`,
  `Посмотреть фильм "На игле"`,
  `Помыть посуду :(`,
  `Выучить все правила бойцовкого клуба`,
  `Попить чая`,
  `Стать великим программистом`,
  `Заказать пиццу`,
  `Заплатить ведьмаку чеканой монетой`,
  `Выучить "Горгород" наизусть`,
];

const DefaultRepeatingDays = {
  [WeekDay.MO]: false,
  [WeekDay.TU]: false,
  [WeekDay.WE]: false,
  [WeekDay.TH]: false,
  [WeekDay.FR]: false,
  [WeekDay.SA]: false,
  [WeekDay.SU]: false,
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {[WeekDay.MO]: Math.random() > 0.5}, {[WeekDay.WE]: Math.random() > 0.5}, {[WeekDay.FR]: Math.random() > 0.5});
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();
  return {
    id: getRandomIntegerNumber(100000000, 110000000),
    color: getRandomArrayItem(COLORS),
    text: getRandomArrayItem(DescriptionItems),
    dueDate,
    repeatingDays: dueDate ? Object.assign({}, DefaultRepeatingDays) : generateRepeatingDays(),
    isArchieve: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};

export {generateTasks, DefaultRepeatingDays};
