export function getLastWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

  const startOfLastWeek = new Date(now); // Create a new date object to avoid modifying the original date
  startOfLastWeek.setDate(now.getDate() - dayOfWeek - 5); // Move to the first day (Sunday) of the previous week

  const endOfLastWeek = new Date(now);
  endOfLastWeek.setDate(now.getDate() - dayOfWeek + 1); // Move to the last day (Saturday) of the previous week

  // Format dates as strings in 'YYYY-MM-DD' format
  const startDateString = formatDate(startOfLastWeek);
  const endDateString = formatDate(endOfLastWeek);

  return {
    start: startDateString,
    end: endDateString,
  };
}

export function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

  const startOfWeek = new Date(now); // Create a new date object to avoid modifying the original date
  startOfWeek.setDate(now.getDate() - dayOfWeek + 2); // Move to the first day (Sunday) of the current week

  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (8 - dayOfWeek)); // Move to the last day (Saturday) of the current week

  // Format dates as strings in 'YYYY-MM-DD' format
  const startDateString = formatDate(startOfWeek);
  const endDateString = formatDate(endOfWeek);

  return {
    start: startDateString,
    end: endDateString,
  };
}

export function getNextWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

  const startOfNextWeek = new Date(now); // Create a new date object to avoid modifying the original date
  startOfNextWeek.setDate(now.getDate() - dayOfWeek + 9); // Move to the first day (Sunday) of the next week

  const endOfNextWeek = new Date(now);
  endOfNextWeek.setDate(now.getDate() + (16 - dayOfWeek)); // Move to the last day (Saturday) of the next week

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
