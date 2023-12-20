export const registerFormData = [
  { type: 'text', name: 'First name', formControl: 'firstName' },
  { type: 'text', name: 'Last name', formControl: 'lastName' },
  { type: 'password', name: 'Password', formControl: 'password' },
  { type: 'password', name: 'Confirm password', formControl: 'confPass' },
  { type: 'text', name: 'Email', formControl: 'email' },
  { type: 'date', name: 'Date of birth', formControl: 'dob' },
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
}
