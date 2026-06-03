# Platform Module

The platform module owns shared concerns that every predefined tracker can use:

- auth
- billing
- workspaces
- tracker activation
- permissions

It should not contain tracker-specific scorekeeping, inventory rules, dashboards, or validation logic.

Tracker definitions live in `tracker-activation/trackerRegistry.ts`. The registry lists product-approved trackers only; it is not a user-editable template list.
