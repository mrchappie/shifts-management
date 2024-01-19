export const deleteAccount: DeleteAccount[] = [
  { type: 'text', formControl: 'email', name: 'Email' },
  { type: 'password', formControl: 'password', name: 'Password' },
];

export interface DeleteAccount {
  type: string;
  name: string;
  formControl: string;
  icon?: string;
  disabled?: boolean;
}
