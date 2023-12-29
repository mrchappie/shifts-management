export const sortShiftsBy: Filter[] = [
  { value: '', name: 'Sort by' },
  { value: 'workplace', name: 'By workplace' },
  { value: 'shiftDate', name: 'By date' },
  { value: 'startTime', name: 'By start time' },
  { value: 'endTime', name: 'By end time' },
  { value: 'wagePerHour', name: 'By wage' },
  { value: 'shiftRevenue', name: 'By revenue' },
];

// export const orderBy: Filter[] = [
//   { value: '', name: '--select--' },
//   { value: 'asc', name: 'Ascending' },
//   { value: 'dsc', name: 'Descending' },
// ];

export const sortUsersBy: Filter[] = [
  { value: '', name: 'Sort by' },
  { value: 'name', name: 'By name' },
  { value: 'age', name: 'By age' },
];

export interface Filter {
  value: string;
  name: string;
}
