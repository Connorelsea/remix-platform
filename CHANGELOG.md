## [0.0.2]

### Added

* Theme support
* Dark theme
  * OLED support for battery saving
* Group invitations
* Group requests
* Chat tabs
* Device and client management
  * Revoke device access if lost, stolen, or old
  * Set up trusted and untrusted devices
  * Secure password expiration checking system
* Responsive Desktop and mobile support

TODO before release:

* Theme

- Ensure vibrancy view in header correctly matches current theme. Color needs to be alpha value so its a bit weird, and it has a large and small state
- Manage app-wide background shadow color in theme

* Views

- DONE Desktop view VS Mobile view

  * DONE Desktop view has two modes (sidebar and full tabs)
  * Mobile view has two modes (dashboard and tabview)

- New Tab page

- All Tab page

* Tabs

- Delete tab (UI and in the duck)
- Fix tab re-organizing/dragging bug
- Full tab view / Hide sidebar

* Subscriptions

- for user: new group
- for user: new friend request
- for user: new group invitation
- for user: new friend
- for user: new message
- for user: new tab sync from other device (device sync)
- for user: new activity (online, offline, inactive) from their relevant users
- for groups: new group requests

## [0.0.1]

### Added

* User search
* Friend requests
* Group profiles (at /+groupName)
* Group chats (at /+groupName/#chat)
* User profiles (at /@username)
