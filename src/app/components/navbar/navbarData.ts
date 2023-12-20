export const userRoutes = [
  { path: '', name: 'homepage' },
  { path: 'my-shifts', name: 'my shifts' },
  { path: 'add-shift', name: 'add shift' },
  { path: 'profile', name: 'profile' },
];

export const adminRoutes = [
  { path: '/admin/dashboard', name: 'dashboard' },
  { path: '/admin/all-users', name: 'all users' },
  { path: '/admin/all-shifts', name: 'all shifts' },
  { path: '/admin/settings', name: 'settings' },
];

export interface NavbarRoutes {
  path: string;
  name: string;
}
