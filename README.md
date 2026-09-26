# Lumora Interiors — Premium Interior Design Studio Website

> **Spaces That Feel Like You.**
> A premium portfolio website for a fictional interior design and architecture studio. It has editorial layouts, cinematic motion and a working consultation system with a protected admin area.

This is the showcase project in the portfolio, built to show a ₹20,000–₹25,000 website package. The difference from a template comes from typography, spacing, image-led storytelling, page transitions and small details, not from extra backend complexity.

---

## 1. Project overview

| Part | What it does |
|---|---|
| **Public website** | Home, About, Projects, six project story pages, Services, and Contact with a consultation form |
| **Consultation system** | The form posts to an Express API, which validates it and saves it to MongoDB, then **emails the enquiry to the studio team** (Mailchimp Transactional or Gmail). The visitor sees a success message. |
| **Admin area** (`/admin`) | A signed-in studio admin can view enquiries, search and filter them, read the full details and change the status (New, Contacted or Completed) |

All studio details, projects, people and testimonials are **fictional demo content**.

---

## 2. Features

**Design & experience**
- Editorial type pairing: *Cormorant Garamond* (display) and *Manrope* (body), with fluid type sizes
- Warm, restrained palette (bone, linen, sand, clay, charcoal) defined once as design tokens
- Varied portfolio layouts (wide, then two offset portraits, then an inset wide image) instead of identical cards
- Long-form project story pages: hero, facts bar, brief, design concept, pull quote, material palette swatches, highlights, gallery and a "next project" link
- Mobile-specific layouts, not just a smaller desktop: its own hero line breaks, a full-screen menu, stacked metadata and swipe-friendly filters

**Motion (Framer Motion)**
- A one-time branded preloader, shown once per browser session
- Curtain page transitions between routes
- Hero reveal: the image unmasks and settles while the headline rises word by word
- Scroll reveals, clip-path image reveals and subtle parallax (desktop only)
- An intro statement whose words light up as you scroll
- A process timeline that draws itself as you scroll, plus animated counters
- Magnetic buttons, underline links and project hover metadata, with a "View" cursor on desktop
- A scroll progress hairline, and a navbar that condenses on scroll and hides while you read downward
- **`prefers-reduced-motion` respected everywhere.** Visitors who set it see no preloader, curtains, parallax, custom cursor or autoplay, and CSS transitions are switched off.

**Functionality**
- Consultation form with inline validation, pill-style radio groups, a honeypot spam trap, and loading, error and success states
- Express API with validation, rate limiting, Helmet, restricted CORS and consistent JSON errors
- MongoDB (Mongoose) `Consultation` model with a status workflow
- JWT-protected admin with bcrypt-hashed passwords. The admin code is split into its own bundle, so none of it ships to public visitors.

**Quality**
- Per-page titles, meta descriptions, Open Graph tags and canonical URLs, plus `robots.txt` and `sitemap.xml`
- Semantic HTML, one `h1` per page, a skip link, visible focus states, labelled forms and an accessible accordion and dialogs
- Responsive, lazy-loaded images with `srcset`, all served from one central image registry

---

## 3. Technology stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 7, JavaScript, Tailwind CSS 4, React Router 7, Framer Motion 12 |
| Backend | Node.js 20+, Express 5 |
| Database | MongoDB with Mongoose 8 |
| Security | bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit |

Dependencies are kept deliberately small. There's no UI kit, icon library, smooth-scroll library or state manager.

---

## 4. Project structure

```
lumora-interiors/
├── frontend/
│   ├── public/                 favicon, og-image.jpg, robots.txt, sitemap.xml, _redirects, images/
│   ├── src/
│   │   ├── animations/         motion.js (shared easing, durations, variants), useParallax.js
│   │   ├── components/         Navbar, MobileMenu, Footer, Img, RevealImage, SplitText, ScrollText,
│   │   │                       Reveal, Magnetic, Button, CustomCursor, ScrollProgress, Preloader,
│   │   │                       Counter, ProjectCard, PageHeader, Accordion, ConsultationForm, Seo …
│   │   ├── data/               images.js (central image registry), projects.js, content.js, site.js
│   │   ├── hooks/              useMediaQuery.js
│   │   ├── layouts/            RootLayout, PageTransition, IntroContext
│   │   ├── pages/              Home, About, Projects, ProjectDetail, Services, Contact, NotFound
│   │   │   └── admin/          AdminApp, AdminLogin, AdminDashboard (code-split)
│   │   ├── sections/           home/* sections + ConsultationCTA
│   │   ├── services/           api.js, consultations.js, auth.js
│   │   ├── styles/index.css    Tailwind import, @theme tokens, component classes
│   │   ├── App.jsx             routes + AnimatePresence page transitions
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── .env.example
│
├── backend/
│   ├── config/                 env.js (validated env), db.js
│   ├── controllers/            consultationController.js, authController.js
│   ├── middleware/             auth.js (JWT), validate.js, rateLimit.js, errorHandler.js
│   ├── models/                 Consultation.js, Admin.js
│   ├── routes/                 consultationRoutes.js, authRoutes.js
│   ├── services/               mailer.js (Mailchimp / SMTP), notifyNewConsultation.js, emailTemplates/
│   ├── scripts/                createAdmin.js, testEmail.js
│   ├── utils/ApiError.js
│   ├── app.js                  Express app (middleware + routes)
│   ├── server.js               connects to MongoDB, starts the server
│   └── .env.example
│
└── README.md
```

---

## 5. MongoDB setup

Pick **one** of these:

**Option A: MongoDB Atlas (free, recommended)**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access:** add a database user with a strong password.
3. **Network Access:** add your IP address. For hosted backends, add `0.0.0.0/0` or the host's outbound IPs.
4. **Connect → Drivers:** copy the connection string and add a database name, e.g.
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/lumora?retryWrites=true&w=majority`

**Option B: Local MongoDB**
Install MongoDB Community Server (or run `docker run -d -p 27017:27017 mongo:7`) and use
`mongodb://127.0.0.1:27017/lumora`

Collections (`consultations`, `admins`) are created automatically the first time data is saved.

---

## 6. Environment variables

Secrets live **only** in `.env` files. These are git-ignored, so only the `.env.example` templates are committed.

**`backend/.env`**

| Variable | Required | Example / notes |
|---|---|---|
| `PORT` | no | `5000` |
| `MONGODB_URI` | **yes** | Connection string from step 5 |
| `JWT_SECRET` | **yes** | Long random string (32+ chars). Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | no | `8h` (how long an admin session lasts) |
| `CLIENT_ORIGIN` | yes in prod | Frontend URL(s) allowed by CORS, comma-separated, e.g. `http://localhost:5173,https://lumora.in` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | for setup | Only read by `npm run create-admin`. You can delete `ADMIN_PASSWORD` afterwards. |
| `NODE_ENV` | no | `production` on your host |
| `MAIL_PROVIDER` | no | `mailchimp`, `smtp` or `none` (default). See section 7b. |
| `MAIL_TO` | for email | Alert recipients, comma-separated |
| `MAIL_FROM` / `MAIL_FROM_NAME` | for Mailchimp | Sender. With Mailchimp this must be on your verified domain. |
| `MAILCHIMP_TRANSACTIONAL_API_KEY` | for Mailchimp | From Mailchimp Transactional → Settings → SMTP & API Info |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | for SMTP | Gmail: `smtp.gmail.com`, `465`, your Gmail address and a 16-character app password |
| `ADMIN_URL` | no | Live site URL. Adds an "Open in admin dashboard" link to each email. |

**`frontend/.env`**

| Variable | Example |
|---|---|
| `VITE_API_URL` | `http://localhost:5000` locally, or `https://api.your-domain.com` in production (no trailing slash) |

The server refuses to start if `MONGODB_URI` or `JWT_SECRET` is missing, and tells you which one.

---

## 7. Running locally

You need **Node.js 20 or newer** (`node -v`).

### Backend

```bash
cd backend
cp .env.example .env        # Windows: copy .env.example .env
# edit .env → set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run create-admin        # creates the admin login (run once; re-run to reset the password)
npm run dev                 # API on http://localhost:5000 (auto-restarts on changes)
```

Check that it's running by opening http://localhost:5000/api/health. You should see `{"success":true,"status":"ok"}`.

### Frontend (in a second terminal)

```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # site on http://localhost:5173
```

### Try it end to end
1. Open http://localhost:5173 → **Start a Project** → submit the form. You should see the success message.
2. Open http://localhost:5173/admin and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set.
3. Your enquiry is listed there. Change its status, open the details or search.

### 7b. Email notifications (every new enquiry → the team's inbox)

After an enquiry is saved, the API emails it to everyone in `MAIL_TO`. The email is laid out as a card with the client's details, their message and **Reply / Call / WhatsApp** buttons. Pressing Reply writes straight back to the client. The result (sent or failed, and why) is stored on the enquiry and shown in the admin details panel.

An email problem never loses an enquiry. The enquiry is saved first, and the visitor always gets their success message. The API waits at most 8 seconds for the mail provider.

**Option A: Mailchimp Transactional** (`MAIL_PROVIDER=mailchimp`)
1. You need a Mailchimp **Standard** (or Premium) plan. The free and Essentials plans can't add Transactional.
2. In your Mailchimp account, find **Transactional Email** and add it to your plan. It's billed in blocks of 25,000 emails (about $20 per block).
3. Open Transactional (mandrillapp.com) → **Settings → Domains → Sending domains**. Add your domain (e.g. `lumorainteriors.in`) and add the **DKIM** (2 CNAME) and **DMARC** (TXT) records it shows at your domain registrar. Wait for both to show as verified.
4. **Settings → SMTP & API Info → + New API Key**. Put the key in `MAILCHIMP_TRANSACTIONAL_API_KEY`.
5. Set `MAIL_FROM=enquiries@yourdomain` (on the verified domain). A `@gmail.com` address will be refused.

**Option B: Gmail (free, no domain)** (`MAIL_PROVIDER=smtp`)
1. On the Gmail account that will send the alerts, turn on **2-Step Verification**.
2. Go to https://myaccount.google.com/apppasswords, create an app password named "Lumora website", and copy the 16 characters.
3. Set `SMTP_USER=<that gmail>` and `SMTP_PASS=<app password>`, and leave `MAIL_FROM` empty. Gmail allows about 500 emails a day.

**Option C: Brevo** (free forever, 300 emails/day, no domain needed) (`MAIL_PROVIDER=smtp`)
1. Sign up at brevo.com. Under **Senders, domains & IPs → Senders**, add your Gmail address and confirm it.
2. Go to **SMTP & API → SMTP**, note the **Login**, and generate an **SMTP key**.
3. Set:
   - `SMTP_HOST=smtp-relay.brevo.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=` the Login
   - `SMTP_PASS=` the SMTP key
   - `MAIL_FROM=` your Gmail

Without your own domain, Brevo shows its own sender address, but the display name and Reply-To (the client) stay correct. That's fine for internal alerts.

**Option D: GMass** (`MAIL_PROVIDER=smtp`)
GMass is free for a 7-day trial (50 emails) and needs a paid plan after that. It still sends through your Gmail account, so Option B gives the same result for free. To use it anyway, set:
- `SMTP_HOST=smtp.gmass.co`
- `SMTP_PORT=587`
- `SMTP_USER=gmass`
- `SMTP_PASS=` your GMass API key
- `MAIL_FROM=` the Gmail address connected to GMass

**Check it:** `npm run test-email` sends a sample alert to `MAIL_TO` and prints exactly what's wrong if it can't.

### Production build

```bash
cd frontend && npm run build     # outputs frontend/dist
npm run preview                  # serves the built site locally
cd ../backend && npm start       # production API
```

---

## 8. API overview

Base URL: `VITE_API_URL`. All responses are JSON: `{ success, message?, data?, errors?, pagination? }`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | – | Health check |
| `POST` | `/api/consultations` | – (rate limited: 8 / 15 min / IP) | Submit a consultation enquiry |
| `POST` | `/api/auth/login` | – (rate limited: 10 failed / 15 min) | Admin sign-in, returns a JWT |
| `GET` | `/api/auth/me` | Bearer | Current admin |
| `GET` | `/api/consultations?status=&search=&page=&limit=` | Bearer | List enquiries (newest first, max 50 per page) |
| `GET` | `/api/consultations/stats` | Bearer | Counts by status |
| `GET` | `/api/consultations/:id` | Bearer | One enquiry |
| `PATCH` | `/api/consultations/:id/status` | Bearer | Body `{ "status": "New" \| "Contacted" \| "Completed" }` |

**Example: submit an enquiry**

```bash
curl -X POST http://localhost:5000/api/consultations \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya Nair","email":"priya@example.com","phone":"+91 98765 43210",
       "projectType":"Residential","location":"Chennai","budget":"₹25–50 Lakhs",
       "message":"Renovating a 3BHK apartment in Adyar."}'
```

Allowed values:
- `projectType`: `Residential`, `Commercial`, `Hospitality` or `Consultation`
- `budget`: `Under ₹10 Lakhs`, `₹10–25 Lakhs`, `₹25–50 Lakhs` or `₹50 Lakhs+`

Validation errors return `400` with a per-field `errors` object, which the form shows next to each field.

**Consultation document**

```js
{ name, email, phone, projectType, location, budget, message,
  status: 'New' | 'Contacted' | 'Completed',   // default 'New'
  createdAt, updatedAt }
```

**Security notes**
- Public input is whitelisted, so visitors can't set `status` or other internal fields.
- Admin passwords are stored only as bcrypt hashes (cost 12), and the hash is never returned by the API.
- Failed logins return the same message whether the email exists or not, and take the same time.
- A honeypot field silently drops bot submissions.
- Admin sessions are JWTs (HS256) sent as `Authorization: Bearer`. They're kept in `sessionStorage`, so they clear when the browser closes, and they expire after `JWT_EXPIRES_IN`.

---

## 9. Replacing images & content

- **Images:** every photo is registered in `frontend/src/data/images.js`. For development they point to Unsplash (free under the Unsplash License). For a real client:
  1. Put their licensed photos in `frontend/public/images/`.
  2. Change the entry to `src: '/images/courtyard-living.jpg'`.
  3. Update the `alt` text.

  Export photos around **2200px wide, as WebP or high-quality JPEG**.
- **Projects:** edit `src/data/projects.js`. Adding an object automatically creates its page at `/projects/<slug>`.
- **Studio details, services, process, stats, testimonials and FAQs:** edit `src/data/site.js` and `src/data/content.js`.
- **Colours and fonts:** edit the `@theme` block in `src/styles/index.css`.

---

## 10. Deployment notes

**Backend (Render, Railway, Fly.io or a VPS)**
- Root directory `backend`, build command `npm install`, start command `npm start`.
- Set every variable from `backend/.env` in the host's dashboard, with `NODE_ENV=production` and `CLIENT_ORIGIN=https://your-frontend-domain`.
- In MongoDB Atlas → Network Access, allow the host's IPs.
- Run `npm run create-admin` once, either from the host's shell or locally against the production `MONGODB_URI`.

**Frontend (Vercel, Netlify or Cloudflare Pages)**
- Root directory `frontend`, build command `npm run build`, output directory `dist`.
- Set `VITE_API_URL=https://your-api-domain` **before** building. Vite bakes it into the bundle at build time.
- SPA routing is already configured: `vercel.json` for Vercel and `public/_redirects` for Netlify.

**Before going live**
- [ ] Replace the demo images with licensed client photos (`data/images.js`).
- [ ] Replace the fictional studio details, projects and testimonials.
- [ ] Set `site.url` in `src/data/site.js`, and update the domain in `public/robots.txt` and `public/sitemap.xml`.
- [ ] Replace `public/og-image.jpg` (1200×630) with a branded photo.
- [ ] Use a strong, unique `JWT_SECRET` and admin password, and serve everything over HTTPS.
- [ ] Consider self-hosting the two Google Fonts for extra speed and privacy.
- [ ] Set up email alerts (section 7b) on the host too, and run `npm run test-email` there once.

---

## Licence

Code: yours to reuse for client work. Demo photos: [Unsplash License](https://unsplash.com/license). Replace them with licensed client imagery before commercial use.
