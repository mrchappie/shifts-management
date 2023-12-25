export const settingsFormData = [
  {
    type: 'text',
    name: 'Username',
    formControl: 'userName',
    icon: 'account_box',
  },
  {
    type: 'text',
    name: 'First name',
    formControl: 'firstName',
    icon: 'person',
  },
  { type: 'text', name: 'Last name', formControl: 'lastName', icon: 'person' },
  { type: 'email', name: 'Email', formControl: 'email', icon: 'mail' },
  { type: 'date', name: 'Date of birth', formControl: 'dob', icon: 'cake' },
  {
    type: 'tel',
    name: 'Phone number',
    formControl: 'phoneNumber',
    icon: 'phone',
  },
];

export interface SettingsForm {
  type: string;
  name: string;
  formControl: string;
  icon: string;
}
