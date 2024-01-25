export const getRouteToNavigate = (parent: string, userIDParams?: string) => {
  if (parent === 'my-shifts') {
    return ['my-shifts'];
  }
  // redirect to all-shifts page after an admin edits a shift from all-shifts page
  if (parent === 'all-shifts') {
    return ['admin/all-shifts'];
  }
  // redirect to edit-user page for that particular user after an admin edits a user shift
  if (parent === 'edit-user') {
    return ['admin/all-users/edit-user', userIDParams];
  }
  // default route when an user adds a shifts
  return ['my-shifts'];
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};
