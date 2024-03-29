export const getMonthStartToEnd = (date: string) => {
  const startDate = new Date(date);
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  );
  const ONE_DAY_IN_MILI = 24 * 60 * 60 * 1000;

  return {
    start: startDate.getTime(),
    end: endDate.getTime() + ONE_DAY_IN_MILI,
  };
};

export const defaultFormValues = (parent: string) => {
  return {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: `${parent != 'all-users' ? 'shiftDate' : 'name'}`,
    orderByQuery: 'dsc',
    yearMonthQuery: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}`,
    queryLimit: 10,
  };
};
