# Equipment Inventory — Fuller System Starter

This version expands the CRUD starter into a more complete system with:
- Equipment details page
- Supply transactions page
- Personnel directory
- Reports page
- Alerts page
- Audit logs page
- Disposal / retirement page
- Users page
- Settings page
- Offices and departments pages

## Setup
1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL`
3. Run:
   - `npm install`
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
   - `npm run seed`
   - `npm run dev`

## Important
This is a strong starter, not a finished enterprise app.
It includes real pages, basic CRUD, and database models, but some modules are starter-grade:
- audit log capture is seeded and page-ready, but you should extend write operations to record every action
- users/settings are basic admin scaffolds
- requests/approvals and auth are still future work
