export const userRoutes = [
  { path: '', name: 'homepage', icon: 'home' },
  { path: 'my-shifts', name: 'my shifts', icon: 'list_alt' },
  { path: 'add-shift', name: 'add shift', icon: 'add_box' },
  { path: 'profile', name: 'profile', icon: 'person' },
];

export const adminRoutes = [
  { path: '/admin/dashboard', name: 'dashboard', icon: 'grid_view' },
  { path: '/admin/all-users', name: 'all users', icon: 'group' },
  { path: '/admin/all-shifts', name: 'all shifts', icon: 'list_alt' },
  // { path: '/admin/settings', name: 'settings', icon: 'settings' },
];

export interface NavbarRoutes {
  path: string;
  name: string;
  icon: string;
}
