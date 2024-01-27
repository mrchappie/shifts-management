export const getMonthStartToEnd = (date: string) => {
  //   if (!date) return;
  console.log(date);
  const startDate = new Date(date);
  const ednDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  );
  console.log(startDate, ednDate);

  return { start: startDate.getMilliseconds(), end: ednDate.getMilliseconds() };
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
