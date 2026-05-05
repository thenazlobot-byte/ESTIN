# ESTIN

# 🐾 PawFlow / Rahma — Pet Care Appointment System

A full-stack veterinary appointment booking platform that connects pet owners with veterinarians for seamless pet healthcare management.

---

## 📋 Project Overview

**PawFlow** (also known as **Rahma**) is a comprehensive pet care platform designed to simplify veterinary appointment booking. The system connects pet owners with veterinarians, enables appointment scheduling, and manages pet health records.

### Key Capabilities
- **User Authentication**: Secure signup/login for pet owners
- **Veterinarian Directory**: Browse and select available vets
- **Appointment Booking**: 4-step booking workflow with calendar selection
- **Pet Health Records**: Upload and manage pet medical documents
- **Dashboard**: Personal dashboard for managing appointments and pets
- **Admin Panel**: Administrative interface for system management
- **Real-time Status**: Track appointment confirmation status

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PawFlow System                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Frontend (React + TypeScript)                                   │
│  ├── Modern UI with Tailwind CSS                                 │
│  ├── Responsive design (mobile/tablet/desktop)                   │
│  ├── State management with Zustand                               │
│  └── Axios HTTP client for API calls                             │
│                          │                                        │
│                          ↓                                        │
│  Backend (Python Flask)                                          │
│  ├── REST API endpoints                                          │
│  ├── JWT authentication                                          │
│  └── Row-Level Security (RLS)                                    │
│                          │                                        │
│                          ↓                                        │
│  Database & Storage (Supabase)                                   │
│  ├── PostgreSQL (structured data)                                │
│  ├── Object Storage (file uploads)                               │
│  └── Built-in Auth system                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ESTIN/
├── PawFlow backend/              # Python Flask API server
│   ├── app.py                    # Main Flask application with all endpoints
│   ├── User.py                   # User profile dataclass
│   ├── Appointment.py            # Appointment dataclass
│   ├── supabase_schema.sql       # Complete database schema + RLS policies
│   ├── requirements.txt          # Python dependencies
│   ├── setup.py                  # Package setup configuration
│   ├── vercel.json               # Vercel deployment config
│   ├── FRONTEND_README.md        # Frontend integration guide
│   ├── README.md                 # Backend documentation
│   └── .env                      # Environment variables (not in git)
│
├── pawflow-frontend/             # React TypeScript application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components (routing)
│   │   ├── services/
│   │   │   └── api.ts            # Axios API client & endpoints
│   │   ├── store/
│   │   │   ├── authStore.ts      # Authentication state (Zustand)
│   │   │   └── appointmentStore.ts # Appointment state
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Utility functions
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Tailwind CSS styles
│   ├── public/                   # Static assets
│   ├── package.json              # NPM dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite build configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── index.html                # HTML entry point
│   ├── README.md                 # Frontend documentation
│   └── node_modules/             # Dependencies (generated)
│
├── front end/                    # Legacy HTML templates (static)
│   ├── rahma_landing_page.html
│   ├── rahma_register_page.html
│   ├── rahma_login_page.html
│   ├── rahma_dashboard.html
│   ├── rahma_appointments_page.html
│   ├── rahma_services_section.html
│   ├── rahma_settings_page.html
│   ├── pet-care-admin-dashboard.html
│   ├── pet-care-portal.html
│   ├── pet-care-step2-service.html
│   ├── pet-care-step3-vet.html
│   ├── pet-care-step4-calendar.html
│   ├── pet-care-confirmation.html
│   ├── ajouter_veterinaire_form.html
│   ├── inviter_admin_form.html
│   ├── veterinaires_page.html
│   ├── administrateurs_page.html
│   ├── rendez_vous_page.html
│   └── rahma_cta_footer.html
│
└── README.md                     # This file
```

---

## 🛠️ Technology Stack

### Backend
| Component | Technology | Purpose |
|-----------|-----------|---------|
| API Server | Python 3 + Flask | REST API framework |
| Database | PostgreSQL (Supabase) | Structured data storage |
| Authentication | Supabase Auth | JWT-based user auth |
| File Storage | Supabase Storage | Pet health records |
| Security | Row-Level Security (RLS) | Data isolation per user |
| Deployment | Vercel + GitHub CI/CD | Serverless hosting |

### Frontend (Modern)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | React 18 | UI library |
| Language | TypeScript | Type-safe JavaScript |
| Build Tool | Vite | Fast bundling |
| Styling | Tailwind CSS | Utility-first CSS |
| State Mgmt | Zustand | Lightweight state |
| HTTP Client | Axios | API requests |
| Routing | React Router v6 | Client-side navigation |
| Icons | Lucide React | Icon components |

### Frontend (Legacy)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Pages | HTML5 | Static markup templates |
| Styling | CSS | Basic styling |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Backend**: Python 3.8+
- **Frontend (React)**: Node.js 18+
- **Database**: Supabase account (free tier available)
- **Git**: For version control

### 1. Backend Setup

```bash
# Navigate to backend directory
cd "PawFlow backend"

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\activate            # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file with Supabase credentials
cat > .env << EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
EOF

# Run Flask server
python app.py
# Server runs at http://localhost:5000
```

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd pawflow-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Update VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
# App runs at http://localhost:5173
```

### 3. Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. In Supabase Dashboard → **SQL Editor** → paste contents of `PawFlow backend/supabase_schema.sql`
3. Click **Run** to create all tables and policies
4. Create a storage bucket named `pet_records`:
   - Dashboard → **Storage** → **New Bucket**
   - Name: `pet_records`
   - Public: **OFF** (private access with RLS)

---

## 📊 Database Design

### Tables Overview

| Table | Purpose | Access Control |
|-------|---------|-----------------|
| `auth.users` | User accounts (managed by Supabase Auth) | Supabase internal |
| `profiles` | Pet owner information | Row-Level Security |
| `veterinarians` | Veterinarian directory | Public read (authenticated only) |
| `appointments` | Appointment bookings | Owner-only CRUD via RLS |
| `pet_records` (storage) | Health document files | Owner-only access via RLS |

### Data Model Relationships

```
User (auth.users)
├── Profile (profiles)
│   └── name, email, phone, avatar
│
├── Appointments (appointments)
│   ├── appointment_date
│   ├── appointment_time
│   ├── status (pending/confirmed/cancelled)
│   ├── pet_name, pet_type
│   ├── reason
│   └── file_path → Storage (pet_records)
│
└── Veterinarian (veterinarians)
    ├── name
    ├── specialty
    └── avatar_url
```

---

## 📡 API Reference

### Base URL
```
http://localhost:5000  (development)
https://your-vercel-url.vercel.app  (production)
```

### Authentication Header
All protected endpoints require:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### 🔐 Authentication

**POST /signup**
- Register new user account
- Body: `{ "email", "password", "full_name", "phone" }`
- Returns: `{ "message", "user_id" }`

**POST /login**
- Login user and get JWT token
- Body: `{ "email", "password" }`
- Returns: `{ "access_token", "user" }`

**POST /logout**
- Invalidate current session
- Returns: `{ "message" }`

#### 👤 Profile

**GET /profile**
- Retrieve current user's profile
- Returns: `{ "id", "full_name", "email", "phone" }`

**PATCH /profile**
- Update user profile
- Body: `{ "full_name"?, "phone"? }`
- Returns: `{ "message", "data" }`

#### 🏥 Veterinarians

**GET /vets**
- List all available veterinarians
- Returns: `[ { "id", "name", "specialty", "avatar_url" } ]`

#### 📅 Appointments

**GET /appointments**
- List user's appointments with vet details
- Returns: `[ { "id", "pet_name", "appointment_date", "status", "veterinarian" } ]`

**POST /appointments**
- Create new appointment
- Body:
  ```json
  {
    "vet_id": "uuid",
    "pet_name": "Buddy",
    "pet_type": "Dog",
    "appointment_date": "2026-06-15",
    "appointment_time": "10:00",
    "reason": "Annual check-up"
  }
  ```
- Returns: `{ "message", "data" }`

**PATCH /appointments/{id}**
- Update appointment (status, details)
- Body: `{ "status": "confirmed" }`
- Returns: `{ "message", "data" }`

**DELETE /appointments/{id}**
- Cancel/delete appointment
- Returns: `{ "message" }`

**POST /appointments/{id}/upload**
- Upload pet health record file
- Form-data: `file` (PDF, JPG, PNG)
- Returns: `{ "message", "file_path", "appointment" }`

#### 🏥 Health Check

**GET /health**
- Check API server status
- Returns: `{ "status": "ok", "project": "PawFlow / Veto-Care" }`

---

## 🔒 Security Features

### Row-Level Security (RLS)
All tables have RLS policies ensuring users can **only access their own data**:

```sql
-- Example: Users can only see their own appointments
SELECT * FROM appointments
  WHERE owner_id = auth.uid()  -- Enforced by Supabase
```

### Authentication Flow
1. User signs up → Supabase creates auth user
2. System auto-creates user profile
3. User logs in → Gets JWT access token
4. Token included in all API requests
5. Backend validates token → Applies RLS policies

### File Upload Security
- Allowed formats: PDF, JPG, PNG
- Files stored in `{owner_id}/{appointment_id}/filename` structure
- RLS prevents unauthorized file access
- Filename sanitization prevents injection attacks

### API Security
- CORS enabled for frontend domain
- All endpoints require authentication (except `/health`)
- Credentials validation on every request
- Double-booking prevention via database constraints

---

## 🎨 Frontend Features

### Pages & Components

1. **Landing Page** (`rahma_landing_page.html`)
   - Hero section with CTA
   - Features overview
   - Footer with contact info

2. **Authentication**
   - Registration form (`rahma_register_page.html`)
   - Login form (`rahma_login_page.html`)
   - JWT token storage & management

3. **User Dashboard** (`rahma_dashboard.html`)
   - Pet management
   - Upcoming appointments
   - Health records overview

4. **Appointment Booking** (4-step flow)
   - Step 1: Service selection (`pet-care-step2-service.html`)
   - Step 2: Veterinarian selection (`pet-care-step3-vet.html`)
   - Step 3: Calendar/Time selection (`pet-care-step4-calendar.html`)
   - Step 4: Confirmation (`pet-care-confirmation.html`)

5. **Appointments** (`rahma_appointments_page.html`)
   - View all appointments
   - Update status
   - Upload health records

6. **Settings** (`rahma_settings_page.html`)
   - Profile management
   - Pet information
   - Preferences

7. **Admin Panel** (`pet-care-admin-dashboard.html`)
   - System overview
   - User management
   - Veterinarian management (`veterinaires_page.html`)
   - Administrator invites (`inviter_admin_form.html`)

---

## 💻 Development Workflow

### Running All Services Locally

**Terminal 1 - Backend:**
```bash
cd "PawFlow backend"
source venv/bin/activate
python app.py
```

**Terminal 2 - Frontend (React):**
```bash
cd pawflow-frontend
npm run dev
```

**Terminal 3 - View in Browser:**
```
http://localhost:5173  (Frontend Vite dev server)
```

### Building for Production

**Backend:**
- Push to GitHub → Vercel auto-deploys
- Environment variables set in Vercel console

**Frontend:**
```bash
npm run build        # Create production bundle
npm run preview      # Test production build locally
```

### Code Quality

**Linting:**
```bash
npm run lint         # Check TypeScript & ESLint
```

**Type Checking:**
```bash
tsc --noEmit         # Check TypeScript types
```

---

## 🚀 Deployment

### Backend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
4. Every push to `main` triggers auto-deploy

### Frontend Deployment

**Option 1: Vercel**
```bash
npm install -g vercel
vercel            # Deploy with CLI
```

**Option 2: GitHub Pages / Netlify**
```bash
npm run build     # Create static files in dist/
# Upload dist/ folder to hosting service
```

### Environment Variables

**Backend (.env)**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_public_key
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000         # Local dev
VITE_API_URL=https://your-backend-url      # Production
```

---

## 🧪 Testing

### Manual Test Checklist

```
[ ] User signup → receives JWT token
[ ] User login → JWT stored in localStorage
[ ] User can view vet directory
[ ] User can create appointment
[ ] Double-booking prevention works
[ ] User A cannot see User B's appointments (RLS)
[ ] User can upload health record file
[ ] User can update appointment status
[ ] User can cancel appointment
[ ] Logout → token cleared
[ ] Health check endpoint responds
```

### Testing with cURL

```bash
# 1. Signup
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","full_name":"Test User"}'

# 2. Login (copy access_token)
TOKEN=$(curl -s -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' | jq -r '.access_token')

# 3. Get vets
curl -s http://localhost:5000/vets \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. Create appointment
curl -X POST http://localhost:5000/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vet_id":"vet-uuid",
    "pet_name":"Buddy",
    "pet_type":"Dog",
    "appointment_date":"2026-06-15",
    "appointment_time":"10:00",
    "reason":"Check-up"
  }'

# 5. Upload file
curl -X POST http://localhost:5000/appointments/appt-uuid/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@health_record.pdf"

# 6. Health check
curl http://localhost:5000/health | jq
```

---

## 📚 Additional Resources

### Documentation
- **Backend Details**: See `PawFlow backend/README.md`
- **Frontend Details**: See `pawflow-frontend/README.md`
- **Database Schema**: See `PawFlow backend/supabase_schema.sql`

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🤝 Contributing

### Git Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push to GitHub: `git push origin feature/your-feature`
4. Create a Pull Request

### Commit Message Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Test additions
- `chore:` - Maintenance tasks

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing documentation in backend/frontend READMEs
2. Review database schema in `supabase_schema.sql`
3. Open an issue on GitHub
4. Contact the development team

---

## 📄 License

All rights reserved © 2026 Rahma Pet Care / PawFlow

---

## 🎯 Project Goals

- ✅ Simplify veterinary appointment booking
- ✅ Secure pet health record management
- ✅ Seamless user experience across devices
- ✅ Scale efficiently with serverless architecture
- ✅ Maintain user data privacy with RLS

---

**Created:** May 2026
**Current Version:** 0.1.0
**Status:** Active Development
