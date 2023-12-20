export const settingsFormData = [
  { type: 'text', name: 'Username', formControl: 'userName' },
  { type: 'text', name: 'First name', formControl: 'firstName' },
  { type: 'text', name: 'Last name', formControl: 'lastName' },
  { type: 'email', name: 'Email', formControl: 'email' },
  { type: 'date', name: 'Date of birth', formControl: 'dob' },
  { type: 'tel', name: 'Phone number', formControl: 'phoneNumber' },
];

export interface SettingsForm {
  type: string;
  name: string;
  formControl: string;
}
