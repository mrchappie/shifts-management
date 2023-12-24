export interface InputType {
  type: string;
  inputType: string;
  formControl: string;
  placeholder?: string;
  defaultValue?: string;
  icon: string;
}

export const formData = [
  {
    type: 'text',
    inputType: 'input',
    formControl: 'shiftID',
    placeholder: 'Shift ID',
    defaultValue: '',
    icon: 'fingerprint',
  },
  {
    type: 'date',
    inputType: 'input',
    formControl: 'shiftDate',
    placeholder: '',
    defaultValue: '',
    icon: 'calendar_month',
  },
  {
    type: 'time',
    inputType: 'input',
    formControl: 'startTime',
    placeholder: '',
    defaultValue: '',
    icon: 'schedule',
  },
  {
    type: 'time',
    inputType: 'input',
    formControl: 'endTime',
    placeholder: '',
    defaultValue: '',
    icon: 'schedule',
  },
  {
    type: 'text',
    inputType: 'select',
    formControl: 'workplace',
    placeholder: 'Workplace',
    defaultValue: '',
    icon: 'apartment',
  },
  {
    type: 'number',
    inputType: 'input',
    formControl: 'wagePerHour',
    placeholder: 'Wage per hour',
    defaultValue: '',
    icon: 'attach_money',
  },
  {
    type: 'text',
    inputType: 'input',
    formControl: 'shiftRevenue',
    placeholder: 'Revenue',
    defaultValue: '',
    icon: 'price_check',
  },
];
