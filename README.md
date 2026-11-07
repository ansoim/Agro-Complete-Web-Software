# Tropica Agro Sales Dashboard

A responsive, no-build-step HTML/CSS/JavaScript prototype for the Tropica Agro sales workflow. It includes an admin workspace, salesperson management, editable sales history, XLSX exports, and an employee leaderboard with 3D trophies.

## Run locally
1. Download and unzip the project.
2. Open the folder with VS Code Live Server or another local HTTP server. The 3D trophy module uses JavaScript modules and may not load when opening the file directly with `file://`.
3. Sign in with an employee name/ID in the form, or choose **Login as admin** for the Jaykishan Tolani admin view.

## Deploy to GitHub Pages
1. Create a GitHub repository (for example `tropica-agro-dashboard`).
2. Upload `index.html`, `styles.css`, `app.js`, `README.md`, `THREE-LICENSE.txt`, and the complete `assets` and `data` folders to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. Your URL will be shown in the Pages section.

## What works in this prototype
- Login screen supports employee sign-in and a separate admin shortcut; the admin profile starts as Jaykishan Tolani.
- Admin navigation includes Overview, Daily Entry, Reports and Sales team; Logout is pinned at the bottom.
- Daily sales entry supports multiple product rows, automatic totals, saving drafts and deleting entries.
- Salesperson list can be added to and deactivated; historical sales entries remain available.
- Sales history can be searched by date, salesperson, product or reference, and old entries can be edited or deleted.
- Product suggestions include names already entered. Entry categories are Pesticide, Insecticide and Others.
- Monthly team target can be changed.
- Publish action marks saved entries live for the employee view.
- Reports table with downloadable XLSX workbooks containing summary and transaction sheets.
- Employee Sales Command Center with a top-three trophy podium, team target gauge and full sales leaderboard.
- Rotating 3D gold, silver and bronze trophies based on the attached Three.js model, with a CSS animated fallback when the 3D module cannot render.
- Admin overview shows the selected reporting month; the sales chart supports 2025, 2026 and overall comparisons, plus an Analyse toggle for the prior-year pattern.
- Salespeople can be deactivated or permanently deleted from the team; their historic transaction and snapshot totals are retained in browser storage and exports.
- Employee view opens as a full-width dashboard without the Admin sidebar.
- Admin name/photo, salesperson roster, target and sales entries are persisted in the current browser using `localStorage`.
- `data/business-data.json` stores the supplied salesperson roster and November aggregate snapshot for later database import. The November figures are not transaction-level data.

## Important: prototype vs production
This is a **UI/UX prototype**, not a production-authenticated application. The role selection is a demo and browser `localStorage` is not a shared database. Different devices will not see each other's edits.

Before using this for real business data, connect:
- Firebase Authentication for secure sign-in.
- Cloud Firestore for shared sales, targets, users and published state.
- Firestore Security Rules for admin/employee role permissions.
- Firebase Hosting (or GitHub Pages for static hosting) for deployment.

Never put Firebase Admin SDK credentials or private service account keys in frontend files. A production implementation should validate roles and access in Firebase, not just hide UI elements in JavaScript.

## Suggested Firestore collections
- `users/{uid}`: displayName, email, role, salespersonId, active
- `salesEntries/{entryId}`: date, salespersonId, product, category, quantity, value, reference, status, createdBy, createdAt, publishedAt
- `salesSnapshots/{month_salesperson}`: month, salespersonId, amount, source (for supplied summary snapshots without transaction detail)
- `monthlyTargets/{yyyy-MM}`: teamTarget, updatedBy, updatedAt
- `monthlyReports/{yyyy-MM}`: optional generated report metadata

## Project structure
```text
tropica-agro-dashboard/
├── index.html
├── styles.css
├── app.js
├── README.md
├── THREE-LICENSE.txt
├── data/
│   ├── business-data.json
│   ├── annual-category-sales-inr.json
│   └── README.md
└── assets/
    ├── tropica-logo.png
    ├── three.module.js
    └── employee-trophies.js
```
