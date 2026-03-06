# Danlaugh Media Production — Portfolio Website

**Dream. Create. Capture.**

A cinematic, production-grade portfolio for a professional video editor. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database + Auth | Supabase |
| Deployment | Vercel |

---

## Project Structure

```
danlaugh-media/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage (all sections)
│   ├── globals.css             # Global styles + CSS vars
│   ├── api/
│   │   └── contact/route.ts    # Contact form API
│   └── admin/
│       ├── layout.tsx          # Admin layout
│       ├── page.tsx            # Admin dashboard
│       └── login/page.tsx      # Login page
├── components/
│   ├── sections/               # Homepage sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Projects.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── ui/                     # Reusable components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectModal.tsx
│   │   └── TestimonialCard.tsx
│   └── admin/                  # Admin components
│       ├── AdminProjects.tsx
│       ├── AdminTestimonials.tsx
│       └── AboutImageManager.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Auth session middleware
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   ├── useTestimonials.ts
│   │   └── useAbout.ts
│   └── utils.ts                # cn() utility
├── types/
│   └── index.ts                # TypeScript interfaces
├── middleware.ts               # Next.js route protection
├── supabase-setup.sql          # DB schema + RLS
└── .env.local.example          # Env vars template
```

---

## Setup Instructions

### Step 1: Clone & Install

```bash
git clone <your-repo>
cd danlaugh-media
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon public key** from Settings > API

### Step 3: Run Database Setup

1. In Supabase Dashboard → SQL Editor → New Query
2. Paste the entire contents of `supabase-setup.sql`
3. Click **Run** — all tables, RLS policies, and seed data will be created

### Step 4: Create Admin User

1. In Supabase Dashboard → Authentication → Users → Add User
2. Enter:
   - **Email:** `Danielchukwubuikem56@gmail.com`
   - **Password:** `DLMP2026`
3. Click Create User

> **Security Note:** The password is never stored in the frontend code. Supabase Auth handles all credential verification.

### Step 5: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Vercel Deployment

1. Push code to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — done!

---

## Admin Panel

**URL:** `/admin/login`

**Features:**
- ✅ Secure Supabase Auth (no hardcoded passwords)
- ✅ Manage Projects (add/edit/delete, category, featured flag)
- ✅ Manage Testimonials (add/edit/delete, featured toggle)
- ✅ Update About Image (URL-based, instant refresh)
- ✅ Protected route — unauthenticated users redirected to login

---

## Adding Your Logo

Replace the placeholder in `components/sections/Navbar.tsx`:

```tsx
// Current placeholder:
<span className="text-accent font-display font-bold text-sm">DL</span>

// Replace with:
<Image src="/logo.png" alt="Danlaugh Media" width={40} height={40} />
```

Place your circular logo at `public/logo.png`.

---

## Brand Colors

| Token | Value |
|---|---|
| Background | `#000000` |
| Secondary BG | `#0f0f0f` |
| Accent Green | `#16A34A` |
| Accent Hover | `#22C55E` |
| Primary Text | `#FFFFFF` |
| Secondary Text | `#A3A3A3` |

---

## Contact

- **WhatsApp / Call:** 08151603641
- **Email:** Danielchukwubuikem56@gmail.com
