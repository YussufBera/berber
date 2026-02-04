# Project Template: Universal Appointment System
**Base Project:** Berber / Barber Shop Management
**Tech Stack:** Next.js 16, TailwindCSS, Prisma (PostgreSQL), Framer Motion.

## 🎯 Objective
This project is designed to be a **universal appointment booking template**. It can be adapted for:
- Nail Salons
- Spas
- Medical Clinics
- Consulting Firms
- Personal Trainers

## 🛠 How to Rebrand (Instructions for AI)
When asking an AI agent to adapt this project for a new business, provide this guide.

### 1. Terminology Replacement
The codebase uses specific terms that should be mapped to the new business domain.
*   **Barber** -> `[Staff_Title]` (e.g., Nail Artist, Therapist, Doctor)
*   **Service** -> `[Service_Title]` (e.g., Manicure, Massage, Consultation)
*   **Shop** -> `[Business_Name]`

**Files to Search & Replace:**
- `src/components/features/LanguageContext.tsx` properties (e.g., `admin.barbers.title`).
- `prisma/schema.prisma` (Model names: `Barber` -> `Staff` optional, but keeping it `Barber` internally is easier to avoid migration hassles unless necessary. Better to just rename UI labels).
- `src/lib/mockData.ts`

### 2. Design & Branding
*   **Colors:** Open `tailwind.config.ts`.
    *   `neon-blue` -> Primary Brand Color
    *   `neon-purple` -> Secondary/Accent Color
    *   `bg-[#111]` -> Background Color (Light/Dark mode)
*   **Fonts:** Open `src/app/layout.tsx`.
*   **Icons:** The project uses `lucide-react`. Replace `Scissors` with relevant icons (e.g., `Sparkles` for nails, `Stethoscope` for medical).

### 3. Localization
The project is fully localized (DE, EN, TR, KU, AR).
*   **File:** `src/components/features/LanguageContext.tsx`
*   **Action:** Update the dictionary values for the new domain.
    *   Ex: `"admin.nav.barbers": "Barbiere"` -> `"admin.nav.barbers": "Nageldesigner"`

### 4. Database
*   If you keep the schema as is, `Barber` table represents employees.
*   If you rename the tables in `schema.prisma`, you MUST run `npx prisma migrate dev` and update all API routes (`src/app/api/...`).

### 5. Images
*   Replace images in `public/` folder.
*   Update generic avatars in `src/lib/mockData.ts`.

## 🚀 Deployment
1.  `npm install`
2.  `npx prisma content push` (or `migrate`)
3.  `npm run dev`
