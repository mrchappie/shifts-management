export const changePassFormInputs: ChangeCredentials[] = [
  { type: 'text', formControl: 'email', name: 'Email' },
  { type: 'password', formControl: 'oldPass', name: 'Old password' },
  { type: 'password', formControl: 'newPass', name: 'New passowrd' },
  {
    type: 'password',
    formControl: 'confNewPass',
    name: 'Confirm new password',
  },
];

export const changeEmailFormInputs: ChangeCredentials[] = [
  { type: 'text', formControl: 'oldEmail', name: 'Old email' },
  { type: 'text', formControl: 'newEmail', name: 'New email' },
  { type: 'password', formControl: 'password', name: 'Password' },
];

export interface ChangeCredentials {
  type: string;
  name: string;
  formControl: string;
  icon?: string;
  disabled?: boolean;
}
