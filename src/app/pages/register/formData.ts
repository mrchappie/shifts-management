export const registerFormData = [
  {
    type: 'text',
    name: 'First name',
    formControl: 'firstName',
    icon: 'badge',
    disabled: false,
  },
  {
    type: 'text',
    name: 'Last name',
    formControl: 'lastName',
    icon: 'badge',
    disabled: false,
  },
  {
    type: 'password',
    name: 'Password',
    formControl: 'password',
    icon: 'password',
    disabled: false,
  },
  {
    type: 'password',
    name: 'Confirm password',
    formControl: 'confPass',
    icon: 'password',
    disabled: false,
  },
  {
    type: 'text',
    name: 'Email',
    formControl: 'email',
    icon: 'mail',
    disabled: true,
  },
  {
    type: 'date',
    name: 'Date of birth',
    formControl: 'dob',
    icon: 'cake',
    disabled: false,
  },
  {
    type: 'checkbox',
    name: 'Accept terms and conditions',
    formControl: 'termsAndConditions',
    disabled: false,
  },
];

export interface RegisterFormDataI {
  type: string;
  name: string;
  formControl: string;
  icon?: string;
  disabled: boolean;
}
