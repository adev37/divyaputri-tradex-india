# Authentication setup added

The website now has:
- Sign in / Sign up shown before the main website.
- Email ownership verification using a 6-digit OTP sent by SMTP email.
- Password hashing with bcrypt.
- JWT login sessions.
- Separate `/admin` login entry.
- Backend-enforced admin-only API access.
- Admin dashboard for registered users and contact enquiries.

## 1. Configure MongoDB and SMTP
Open `server/.env` and fill:
- `MONGO_URI`
- `JWT_SECRET`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

For Gmail, use a Google App Password (not your normal Gmail password).

## 2. Admin account
Default admin credentials in the supplied `.env` are:
- Email: `admin@divyaputritradex.com`
- Password: `ChangeThisToAStrongPassword123!`

Change `ADMIN_PASSWORD` before using the site publicly.

Run from `server`:
```bash
npm install
npm run seed:admin
npm run dev
```

## 3. Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

If the frontend is hosted somewhere else, set `VITE_API_URL` to the deployed backend URL, for example:
`VITE_API_URL=https://your-api-domain.com/api`

## Important
Email verification proves that the person can receive mail at the address. It cannot prove that an email address is a real person's identity.

The original uploaded project contained a MongoDB connection string in `server/.env`. The delivered project replaces that secret with a placeholder. If that database credential was real, rotate its password in MongoDB Atlas and put the new connection string into `server/.env`.
