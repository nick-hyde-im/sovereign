# sovereign

Simple app to keep track of the team members who have held the sprint sovereign crown.

## Basic Functionality

The app is driven by the backend data on Supabase. Team members have a `times_crowned` field which is incremented each time they are elected sovereign. The app uses this to decide who is a valid candidate for the next sprint. Each sprint is tracked in the back end with its relevant sovereign.

When a new sovereign is crowned, the next sprint is automatically created in the back end using the most likely sprint start and end dates. If they need adjusting, this can be done in the UI by clicking on the start/end dates.

Technically, team members belong to a team. This is not currently used in the app (everyone is on the P&C team) but was put in for future expansion.

Auth (GitHub OAuth) is also set up but is not really used, save that at present only authenticated users can edit sovereigns once crowned via the UI.

## Future Functionality

Admin functionality to create new teams and update team members.

## Local Development

### Prerequisites

1. The Supabase CLI (installed as a dev dependency, though you may need to log in) - [see docs](https://supabase.com/docs/guides/cli)
2. A `.env` file containing a `GITHUB_CLIENT_ID` and `GITHUB_SECRET` for a GH Oauth application
3. Docker running (required for local supabase development environment)
4. A TeamUp API key (this is free)

### Instructions

1. Run `yarn sb:start`
2. Take note of the output so you can populate the below variables
3. Create an `.env.local` and add the following:

   ```sh
   VITE_SUPABASE_URL="<API URL>"
   VITE_SUPABASE_ANON_KEY="<anon key>"
   VITE_TEAMUP_API_KEY="<your teamup api key>"
   ```

4. Run `yarn dev` to run the front end
