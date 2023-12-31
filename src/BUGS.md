## BUGS

1.  Register BUG - after register, it is not redirecting the user to dashboard, it goes to login page
2.  Edit shift - if I am on teh edit shift page, if I refresh the page, all the informations are gone
    - save current shifts to localStorage
3.  Revenue logic - revenue is only calculated when wage input is chnaged but it needs calculation when start and end time inputs are chnaged also
4.  If I manually redirect to 404 page, and the page is refreshed, user info are lost because no active component makes a DB call
5.  Charts do not update correctly on load

## FEATURES

- Sort shifts by timestamp at load ❌
- Toast notificatins - implement from scratch
- Admin dashboard statistics about users, shifts, etc. like numbers this month and per total.
- Dark Mode
- Sort algorithm ✅
- Order algorithm ✅
- Query limit on shifts / users ✅
- Fetch shifts by year-month ✅
- Grid / list selector
