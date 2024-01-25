const now = new Date();
const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
const currentWeekStartDay = now.getDate() - dayOfWeek + 1;
const currentWeekEndDay = now.getDate() - dayOfWeek + 7;

export function getLastWeekDates() {
  const NUM_OF_DAYS_TILL_WEEK_START = 7;
  const NUM_OF_DAYS_TILL_WEEK_END = 1;

  const startOfLastWeek = new Date(now); // Create a new date object to avoid modifying the original date
  startOfLastWeek.setDate(currentWeekStartDay - NUM_OF_DAYS_TILL_WEEK_START); // Move to the first day (Monday) of the previous week

  const endOfLastWeek = new Date(now);
  endOfLastWeek.setDate(currentWeekStartDay - NUM_OF_DAYS_TILL_WEEK_END); // Move to the last day (Sunday) of the previous week

  // Format dates as strings in 'YYYY-MM-DD' format
  const startDateString = formatDate(startOfLastWeek);
  const endDateString = formatDate(endOfLastWeek);

  return {
    start: startDateString,
    end: endDateString,
  };
}

export function getCurrentWeekDates() {
  const startOfWeek = new Date(now); // Create a new date object to avoid modifying the original date
  startOfWeek.setDate(currentWeekStartDay); // Move to the first day (Monday) of the current week

  const endOfWeek = new Date(now);
  endOfWeek.setDate(currentWeekEndDay); // Move to the last day (Sunday) of the current week

  // Format dates as strings in 'YYYY-MM-DD' format
  const startDateString = formatDate(startOfWeek);
  const endDateString = formatDate(endOfWeek);

  return {
    start: startDateString,
    end: endDateString,
  };
}

export function getNextWeekDates() {
  const NUM_OF_DAYS_TILL_WEEK_START = 1;
  const NUM_OF_DAYS_TILL_WEEK_END = 7;

  const startOfNextWeek = new Date(now); // Create a new date object to avoid modifying the original date
  startOfNextWeek.setDate(currentWeekEndDay + NUM_OF_DAYS_TILL_WEEK_START); // Move to the first day (Monday) of the next week

  const endOfNextWeek = new Date(now);
  endOfNextWeek.setDate(currentWeekEndDay + NUM_OF_DAYS_TILL_WEEK_END); // Move to the last day (Sunday) of the next week

  // Format dates as strings in 'YYYY-MM-DD' format
  const startDateString = formatDate(startOfNextWeek);
  const endDateString = formatDate(endOfNextWeek);

  return {
    start: startDateString,
    end: endDateString,
  };
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export const dateToMiliseconds = (date: string) => {
  return new Date(date).getTime();
};
