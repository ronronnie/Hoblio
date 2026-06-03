# Cricket Tracker Module

The Cricket Tracker is the first MVP tracker and owns its own product logic.

This module should contain cricket-specific:

- routes and route-facing components
- database table contracts and typed data access
- match creation flows
- manual score entry
- score and leaderboard calculations
- validation rules
- dashboard and player profile UI
- AI text entry and confirmation logic later
- voice recording logic later

Platform concerns such as auth, workspace membership, billing, permissions, and tracker activation belong in `src/modules/platform`.

Do not move cricket behavior into a generic template builder, dynamic schema builder, or Notion-like record system. Cricket is a developer-implemented tracker app with explicit tables, validation, and business logic.
