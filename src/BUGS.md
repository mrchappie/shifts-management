## BUGS

1. Register BUG - after register, it is not redirecting the user to dashboard, it goes to login page ✅
2. Edit shift - if I am on the edit shift page, if I refresh the page, all the informations are gone
   - save current shifts to localStorage
3. Revenue logic - revenue is only calculated when wage input is chnaged but it needs calculation when start and end time inputs are chnaged also
4. If I manually redirect to 404 page, and the page is refreshed, user info are lost because no active component makes a DB call
5. Charts do not update correctly on load ✅
6. Bug password confirm - pattern validator doesn't work with custom password validator
7. Bug age validation ✅
8. If an admin edits a user shift, loaded workplaces are not for the edited user, they are the workplaces of the cuurent logged user
9. Refetch data after refresh for all siblings components that use data saved in state from other components

## FEATURES

1. Sort shifts by timestamp at load
2. Toast notificatins - implement from scratch
3. Admin dashboard statistics about users, shifts, etc. like numbers this month and per total. ✅
4. Dark Mode ✅
5. Sort algorithm ✅
6. Order algorithm ✅
7. Query limit on shifts / users ✅
8. Fetch shifts by year-month ✅
9. Grid / list selector
10. Google ang Github login
