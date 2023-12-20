export const sorterBy = [
  { value: '', name: '--select--' },
  { value: 'workplace', name: 'By workplace' },
  { value: 'shiftDate', name: 'By date' },
  { value: 'startTime', name: 'By start time' },
  { value: 'endTime', name: 'By end time' },
  { value: 'wagePerHour', name: 'By wage' },
  { value: 'shiftRevenue', name: 'By revenue' },
];

export const orderBy = [
  { value: '', name: '--select--' },
  { value: 'asc', name: 'Ascending' },
  { value: 'dsc', name: 'Descending' },
];

export const tableHeadInfo = [
  'ID',
  'Date',
  'Start Time',
  'End Time',
  'Workplace',
  'Wage',
  'Revenue',
];

export interface Filter {
  value: string;
  name: string;
}
