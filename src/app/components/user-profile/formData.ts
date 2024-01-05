export const settingsFormData = [
  {
    type: 'text',
    name: 'Username',
    formControl: 'userName',
    icon: 'account_box',
    disabled: false,
  },
  {
    type: 'text',
    name: 'First name',
    formControl: 'firstName',
    icon: 'person',
    disabled: false,
  },
  {
    type: 'text',
    name: 'Last name',
    formControl: 'lastName',
    icon: 'person',
    disabled: false,
  },
  {
    type: 'email',
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
    type: 'tel',
    name: 'Phone number',
    formControl: 'phoneNumber',
    icon: 'phone',
    disabled: false,
  },
];

export interface SettingsForm {
  type: string;
  name: string;
  formControl: string;
  icon: string;
  disabled: boolean;
}
