# Tropica Agro Sales Dashboard

Static HTML/CSS/JavaScript frontend connected to Firebase Authentication and Cloud Firestore. No build step is required. Use an HTTP server such as VS Code Live Server locally; JavaScript modules and the 3D trophy renderer do not work correctly from `file://`.

## Firebase setup

The app is registered in the Firebase project `tropica-agro-dashboard`. The browser configuration in `firebase-config.js` is public project identification, not an admin credential. Never add service-account keys or passwords to this repository.

1. Enable Email/Password in Firebase Authentication.
2. Create a Firestore database and deploy `firestore.rules` from the Firebase console Rules tab.
3. Create an Authentication account for the administrator. In Firestore, create `users/{uid}` using that account's UID with `displayName`, `email`, `role: "admin"`, and `active: true`.
4. Create employee accounts and matching `users/{uid}` profiles with `role: "employee"`, `salespersonId`, and `active: true`.
5. Sign in to the dashboard as admin and use **Reports → Import JSON to Firebase** to import the private business-data JSON and annual sales JSON separately.

The app will show a permission error until profile documents exist and the Firestore rules are deployed. Do not use test mode or rules that allow public reads/writes.

## GitHub Pages

Upload the frontend files and `assets` folder to the repository root with `index.html` at the root. Do not upload real sales/employee data JSON files; import those through the authenticated admin screen. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save. The site is public, but Firebase data access is controlled by Authentication and Firestore Rules.

## Features

- Admin and employee sign-in through Firebase Authentication.
- Shared salespeople, sales entries, snapshots, monthly targets and annual reports in Firestore.
- Live Firestore listeners keep signed-in dashboards up to date across devices.
- Sessions expire eight hours after authentication; Firestore Rules reject older auth sessions.
- Saves write only changed Firestore documents instead of rereading and replacing whole collections.
- Admin sales entry, editing, XLSX exports and JSON import/backup.
- Employee leaderboard and rotating trophy podium.
- `firestore.rules` denies access unless the signed-in account has an active role profile.

## Files

```text
index.html
app.js
firebase-client.js
firebase-config.js
firestore.rules
styles.css
assets/
  employee-trophies.js
  three.module.js
  tropica-logo.png
data/README.md
```
