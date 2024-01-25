export const sortShiftsBy: Filter[] = [
  { value: '', name: '-- Sort by --' },
  { value: 'workplace', name: 'By workplace' },
  { value: 'shiftDate', name: 'By date' },
  { value: 'startTime', name: 'By start time' },
  { value: 'endTime', name: 'By end time' },
  { value: 'wagePerHour', name: 'By wage' },
  { value: 'shiftRevenue', name: 'By revenue' },
];

export const sortUsersBy: Filter[] = [
  { value: '', name: '-- Sort by --' },
  { value: 'name', name: 'By name' },
  { value: 'age', name: 'By age' },
];

export interface Filter {
  value: string;
  name: string;
}

export interface UsersSelect {
  userID: string;
  firstName: string;
  lastName: string;
}
