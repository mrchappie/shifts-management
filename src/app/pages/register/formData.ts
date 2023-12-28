export const registerFormData = [
  {
    type: 'text',
    placeholder: 'First name',
    formControl: 'firstName',
    icon: 'badge',
    disabled: false,
  },
  {
    type: 'text',
    placeholder: 'Last name',
    formControl: 'lastName',
    icon: 'badge',
    disabled: false,
  },
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
  {
    type: 'text',
    placeholder: 'Email',
    formControl: 'email',
    icon: 'mail',
    disabled: false,
  },
  {
    type: 'date',
    placeholder: 'Date of birth',
    formControl: 'dob',
    icon: 'cake',
    disabled: false,
  },
  {
    type: 'checkbox',
    placeholder: 'Accept terms and conditions',
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
