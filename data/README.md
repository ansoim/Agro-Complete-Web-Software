# Business data file

`business-data.json` is the central, portable source file for real business records. It contains the supplied salesperson roster and November 2026 aggregate sales snapshot. Transaction-level records are empty because the screenshot did not include individual dates, products, quantities, or references. Add verified transaction records here as they become available. Do not put passwords, payment credentials, or private service account keys in this file.

The separate [`annual-category-sales-inr.json`](annual-category-sales-inr.json) file preserves the 2025–2026 monthly Agro, Chemical, Oil and total sales from the other supplied dashboard image. That source is in INR and is kept separate from the employee snapshot in XOF/FCFA.

## Collections and fields

- `currency`: ISO currency code for sales and targets. `XOF` is used for the supplied salesperson screenshot (shown as CFA/FCFA).
- `businessTimezone`: IANA timezone used to interpret entry dates (for example, `Africa/Abidjan`).
- `salespeople`: `id`, `name`, `email` (optional), `region` (optional), `active`.
- `salesEntries`: `id`, `date` (`YYYY-MM-DD`), `salespersonId`, `product`, `category`, `quantity`, `value`, `reference` (optional), `status` (`draft` or `published`), `createdAt` (optional ISO timestamp), `publishedAt` (optional ISO timestamp).
- `salesSnapshots`: `month` (`YYYY-MM`), `salespersonId`, and `amount` for a supplied aggregate snapshot when transaction details are unavailable. Keep these separate from individual transactions to avoid making up dates or products.
- `monthlyTargets`: `month` (`YYYY-MM`), `teamTarget`, `updatedAt` (optional ISO timestamp).
- `users`: `id`, `displayName`, `email`, `role` (`admin` or `employee`), `salespersonId` (required for employees), `active`. Store authentication credentials in the eventual authentication provider, never here.

## Example record shapes

```json
{
  "salespeople": [
    {
      "id": "sp-001",
      "name": "Example Name",
      "email": "person@example.com",
      "region": "West",
      "active": true
    }
  ],
  "salesEntries": [
    {
      "id": "sale-001",
      "date": "2026-11-07",
      "salespersonId": "sp-001",
      "product": "Example product",
      "category": "Pesticide",
      "quantity": 10,
      "value": 25000,
      "reference": "INV-001",
      "status": "draft"
    }
  ],
  "monthlyTargets": [
    { "month": "2026-11", "teamTarget": 1000000 }
  ],
  "users": [
    {
      "id": "user-001",
      "displayName": "Example Name",
      "email": "person@example.com",
      "role": "employee",
      "salespersonId": "sp-001",
      "active": true
    }
  ]
}
```

The app loads this file as its initial roster and snapshot when the browser has no saved roster. Its Reports page can download a fresh JSON backup after records change. Browser edits are stored in `localStorage`; they do not silently rewrite this source file. Use the downloaded backup as the updated portable data file for review and later database import.
