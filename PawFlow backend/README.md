# 🐾 PawFlow — Veto-Care Backend

A **serverless cloud backend** for the Veto-Care veterinary appointment system, built with:

| Layer | Technology |
|---|---|
| Auth (Table A) | Supabase Auth (built-in) |
| Database | PostgreSQL via Supabase |
| API Server | Python / Flask |
| Storage | Supabase Storage |
| Security | Row Level Security (RLS) |
| Deployment | Vercel + GitHub CI/CD |

---

## 📐 Database Design (Table Mapping)

| Table | Name | Purpose |
|---|---|---|
| A | `auth.users` + `profiles` | Pet owners (managed by Supabase Auth) |
| B | `veterinarians` | Vet doctors list |
| C | `appointments` | Booking records (owner ↔ vet) |
| Storage | `pet_records` bucket | Animal health record files |

---

## 🚀 Phase 1 — Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR-USERNAME/pawflow-backend.git
cd pawflow-backend
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Linux / Mac
# venv\Scripts\activate         # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Add your Supabase credentials
Copy `.env` and fill in your real values:
```
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXXXXXXXX
```

> ⚠️ **How to find these:**
> Supabase → Project → Settings → API → copy **Project URL** and **anon / public** key.

### 5. Run locally
```bash
python app.py
```
API is now live at `http://localhost:5000`

---

## 🗄️ Phase 2 — Supabase Setup

### 1. Create Supabase project
- Go to [supabase.com](https://supabase.com)
- New Project → choose a name and strong DB password

### 2. Run the schema
- Supabase Dashboard → **SQL Editor** → **New Query**
- Paste the full contents of `supabase_schema.sql`
- Click **Run** ✅

### 3. Create the Storage bucket
- Supabase Dashboard → **Storage** → **New Bucket**
- Name: `pet_records`
- Public: **OFF** (private — RLS handles access)

---

## 🔒 Security (RLS Policies)

Every table has Row Level Security enabled. Users can **only see, create, update, or delete their own data**.

| Table | Policy |
|---|---|
| `profiles` | Read + update own row only |
| `veterinarians` | Any authenticated user can read |
| `appointments` | Full CRUD for owner only |
| `storage.objects` | Upload/read own folder only |

---

## 📡 API Reference

All protected endpoints require the header:
```
Authorization: Bearer <access_token>
```

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register new user |
| `POST` | `/login` | Login — returns JWT token |
| `POST` | `/logout` | Invalidate session |

**Signup body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "Ahmed Ali",
  "phone": "0512345678"
}
```

**Login response:**
```json
{
  "access_token": "eyJ...",
  "user": { "id": "uuid", "email": "user@example.com" }
}
```

---

### Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Get current user's profile |
| `PATCH` | `/profile` | Update full_name or phone |

---

### Veterinarians (Table B)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/vets` | List all vets |

---

### Appointments (Table C)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/appointments` | List own appointments (with vet info) |
| `POST` | `/appointments` | Create appointment |
| `PATCH` | `/appointments/<id>` | Update status or details |
| `DELETE` | `/appointments/<id>` | Cancel/delete appointment |
| `POST` | `/appointments/<id>/upload` | Upload pet health record (PDF/image) |

**Create appointment body:**
```json
{
  "vet_id": "uuid-of-vet",
  "pet_name": "Buddy",
  "pet_type": "Dog",
  "appointment_date": "2026-06-15",
  "appointment_time": "10:00",
  "reason": "Annual check-up"
}
```

---

## 🧪 Phase 7 — Testing Checklist

Run through all of these before submitting:

- [ ] User A signs up → gets JWT token
- [ ] User A creates an appointment
- [ ] User B signs up with different email → gets their own JWT
- [ ] User B fetches `/appointments` → **sees zero rows** (RLS working ✅)
- [ ] User A uploads a file → stored under `{A_id}/filename`
- [ ] User B tries to access User A's file → **denied** ✅
- [ ] Login/logout flow works end-to-end
- [ ] Appointment status can be updated to `confirmed` or `cancelled`

---

## 🚀 Phase 8 — Deployment (Vercel + GitHub CI/CD)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial Veto-Care backend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pawflow-backend.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework Preset: **Other**
4. Click **Deploy**

### 3. Add Environment Variables in Vercel
In Vercel → Project → **Settings** → **Environment Variables**, add:

| Key | Value |
|---|---|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGci...` (your anon key) |

> ⚠️ **NEVER put real values in `.env` and push to GitHub.**
> `.env` is in `.gitignore` — Vercel reads secrets from its own secure settings panel.

### 4. Every push to `main` = automatic redeploy ✅

---

## 📁 Project Structure

```
pawflow-backend/
├── app.py              ← Flask API (all endpoints)
├── User.py             ← Profile dataclass (Table A helper)
├── Appointment.py      ← Appointment dataclass (Table C helper)
├── supabase_schema.sql ← Full DB schema + RLS + Storage policies
├── requirements.txt    ← Python dependencies
├── vercel.json         ← Vercel deployment config
├── .env                ← 🔒 Your secrets (NOT in Git)
└── .gitignore          ← Excludes .env and pycache
```

---

## 🏗️ Architecture Answers

### 1. Why Supabase + Vercel = OPEX vs CAPEX

**CAPEX (Capital Expenditure)** means buying physical infrastructure upfront: servers, data centre racks, network hardware. You pay a large fixed cost regardless of actual usage, and you own/maintain the hardware.

**OPEX (Operational Expenditure)** means paying only for what you consume as you go — no upfront hardware cost.

Supabase + Vercel is pure OPEX:
- **Supabase** bills per database row, storage GB, and API requests. Zero servers to buy.
- **Vercel** bills per function invocation and GB-hours of compute. You deploy code, not machines.
- If traffic is zero, cost is (nearly) zero. If traffic spikes, capacity scales automatically and you pay for that burst.

For a school/startup project this is ideal: you start on the free tier and only pay once you have real users.

---

### 2. How Serverless Scaling Works vs Physical Servers

| | Physical Server | Serverless (Vercel Functions) |
|---|---|---|
| Provisioning | Manual, takes hours/days | Automatic, milliseconds |
| Idle cost | Always running (24/7 cost) | Zero — no invocation = no cost |
| Traffic spike | Crashes if over capacity | Scales to thousands of instances instantly |
| Maintenance | You patch the OS, reboot, monitor | Fully managed by the provider |
| State | Persistent in memory | Stateless — each request is independent |

When a user hits `POST /appointments`, Vercel spins up a fresh Python process, runs the Flask handler, returns the response, then destroys the process. The next request might run on a completely different machine. This is why we store all state in Supabase (database + storage) — the Flask layer itself is intentionally stateless.

---

### 3. Structured Data vs Non-Structured Data (Carnet de Santé)

**Structured data** lives in relational tables with fixed columns, types, and relationships:
- `appointments`: `id`, `owner_id`, `vet_id`, `appointment_date`, `status` — every row has the same shape.
- You can query it: `WHERE status = 'pending'`, join with `veterinarians`, sort by date.
- Stored in **Supabase PostgreSQL**.

**Non-structured (unstructured) data** has no fixed schema — it's a binary blob:
- A "Carnet de santé" PDF or JPEG is just bytes. You cannot `WHERE` inside a PDF.
- You store it in an **object store** (Supabase Storage / S3-compatible), identified by a path (`{owner_id}/{appointment_id}/carnet.pdf`).
- The *link* between the two worlds is `appointments.file_path` — a structured column pointing to the unstructured blob.

This separation is a core cloud architecture pattern: relational DB for queryable data, object store for files.

---

### 4. Supabase Keys — Publishable vs Secret

| Key | Name | When to use |
|---|---|---|
| `anon` / `publishable` | Safe to expose | All normal operations with RLS enabled |
| `service_role` / secret | **Never expose** | Admin tasks: bypass RLS, seed data, migrations |

This backend uses **only the anon key**. RLS policies enforce that users can only see/modify their own rows — the anon key alone cannot bypass that. The service role key would be used only in a secure server-side migration script, never in client-facing code.

---

### 5. Full Test Flow (curl)

```bash
# 1. Sign up
curl -s -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Test1234!","full_name":"Alice"}' | jq

# 2. Login → copy the access_token
TOKEN=$(curl -s -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Test1234!"}' | jq -r '.access_token')

# 3. List vets → pick a vet UUID
curl -s http://localhost:5000/vets \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. Create appointment (replace VET_ID with real UUID from step 3)
curl -s -X POST http://localhost:5000/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"vet_id":"VET_ID","pet_name":"Buddy","pet_type":"Dog","appointment_date":"2026-07-01","appointment_time":"10:00","reason":"Annual check-up"}' | jq

# 5. Upload health record (replace APPT_ID with the id from step 4)
curl -s -X POST http://localhost:5000/appointments/APPT_ID/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/carnet.pdf" | jq

# 6. Fetch dashboard
curl -s http://localhost:5000/appointments \
  -H "Authorization: Bearer $TOKEN" | jq

# 7. Logout
curl -s -X POST http://localhost:5000/logout \
  -H "Authorization: Bearer $TOKEN" | jq
```
