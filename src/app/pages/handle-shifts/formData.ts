export interface InputType {
  type: string;
  inputType: string;
  formControl: string;
  placeholder?: string;
  defaultValue?: string;
}

export const formData = [
  {
    type: 'text',
    inputType: 'input',
    formControl: 'shiftID',
    placeholder: 'Shift ID',
    defaultValue: '',
  },
  {
    type: 'date',
    inputType: 'input',
    formControl: 'shiftDate',
    placeholder: '',
    defaultValue: '',
  },
  {
    type: 'time',
    inputType: 'input',
    formControl: 'startTime',
    placeholder: '',
    defaultValue: '',
  },
  {
    type: 'time',
    inputType: 'input',
    formControl: 'endTime',
    placeholder: '',
    defaultValue: '',
  },
  {
    type: 'text',
    inputType: 'select',
    formControl: 'workplace',
    placeholder: 'Workplace',
    defaultValue: '',
  },
  {
    type: 'number',
    inputType: 'input',
    formControl: 'wagePerHour',
    placeholder: 'Wage per hour',
    defaultValue: '',
  },
  {
    type: 'text',
    inputType: 'input',
    formControl: 'shiftRevenue',
    placeholder: 'Revenue',
    defaultValue: '',
  },
];
