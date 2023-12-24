export const registerFormData = [
  { type: 'text', name: 'First name', formControl: 'firstName', icon: 'badge' },
  { type: 'text', name: 'Last name', formControl: 'lastName', icon: 'badge' },
  {
    type: 'password',
    name: 'Password',
    formControl: 'password',
    icon: 'password',
  },
  {
    type: 'password',
    name: 'Confirm password',
    formControl: 'confPass',
    icon: 'password',
  },
  { type: 'text', name: 'Email', formControl: 'email', icon: 'mail' },
  { type: 'date', name: 'Date of birth', formControl: 'dob', icon: 'cake' },
  {
    type: 'checkbox',
    name: 'Accept terms and conditions',
    formControl: 'termsAndConditions',
  },
];

export interface RegisterFormDataI {
  type: string;
  name: string;
  formControl: string;
  icon?: string;
}
