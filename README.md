## SD-15 Community Org App
A centralized web application built for 3MTT program participants and community managers. This platform solves the challenge of scattered communications by providing role-based access, track-specific resource filtering, and a unified event dashboard.
### 🚀 Live Demo & Walkthrough
 * **Live Application:** [https://sd15-community-app.vercel.app/login]
 * **Demo Video (2-3 mins):** [https://youtube.com/shorts/vV-pMUiuR8w?si=DRMH17Q7n_rp-B1R]
### 🛠 Tech Stack
 * **Frontend:** Next.js (App Router), React, Tailwind CSS
 * **Backend & Database:** Supabase (PostgreSQL)
 * **Authentication:** Supabase Auth (Email/Password)
 * **Deployment:** Vercel
### ✨ Core MVP Features
 * **Role-Based Access Control (RBAC):** Distinct permissions for "Students" (Fellows) and "Admins" (Community Managers).
 * **Track-Specific Dashboards:** Announcements and events are automatically filtered using Row Level Security (RLS) so users only see content relevant to their specific learning track.
 * **Global Broadcasting:** Admins can publish platform-wide announcements visible to all cohorts.
 * **Event Management:** A dedicated scheduling interface to keep track of upcoming classes, deadlines, and community meetups.
### 🔑 Test Credentials for Evaluators
To explore the role-based routing and features, please use the following credentials on the live application:
**Admin Account (Community Manager view):**
 * **Email:** admin@3mtt.com
 * **Password:** password123
**Student Account (Software Development Track view):**
 * **Email:** student@3mtt.com
 * **Password:** password123
### 💻 Local Setup Instructions
To run this repository locally on your machine, follow these steps:
 1. Clone the repository:
```bash
git clone [https://github.com/Abulkhoir-loruko-mi/sd15-community-app.git]

```
 2. Navigate into the project directory:
```bash
cd sd15-community-app

```
 3. Install the dependencies:
```bash
npm install

```
 4. Create a .env.local file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```
 5. Start the development server:
```bash
npm run dev

```
Open http://localhost:3000 in your browser to view the application.
### 👨‍💻 Author
**Oladeji Sooliu Ayantunji**
3MTT Software Development Fellow
