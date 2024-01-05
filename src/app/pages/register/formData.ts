export const registerFormData = [
  { type: 'text', name: 'First name', formControl: 'firstName', icon: 'badge' },
  { type: 'text', name: 'Last name', formControl: 'lastName', icon: 'badge' },
  {
    type: 'password',
    placeholder: 'Password',
    formControl: 'password',
    icon: 'password',
    disabled: false,
  },
  {
    type: 'password',
    placeholder: 'Confirm password',
    formControl: 'confPass',
    icon: 'password',
    disabled: false,
  },
  { type: 'text', name: 'Email', formControl: 'email', icon: 'mail' },
  { type: 'date', name: 'Date of birth', formControl: 'dob', icon: 'cake' },
  {
    type: 'checkbox',
    name: 'Accept terms and conditions',
    formControl: 'termsAndConditions',
    disabled: false,
  },
];

export interface RegisterFormDataI {
  type: string;
  placeholder: string;
  formControl: string;
  icon?: string;
  disabled: boolean;
}
