# TDC (The Date Crew) Matchmaking Platform

A modern, full-stack CRM and algorithmic matchmaking dashboard designed for professional matchmakers. The platform allows matchmakers to track client pipelines, view algorithmic compatibility scores, generate AI-powered introduction emails, and manage the entire lifecycle of a client from "New" to "Matched."

## 🚀 Live Demo & Deliverables
- **Live Hosted Link:** [Insert your Vercel/Netlify link here]
- **Sample Login Credentials:** 
  - **Username:** matchmaker@thedatecrew.com
  - **Password:** password123

---

## 📝 Project Write-up

### Tech Choices
This project was built using **Next.js 16 (App Router)** and **React** for a seamless full-stack experience, allowing the UI and API routes to co-exist in a single repository. I chose **Tailwind CSS** alongside **Phosphor Icons** to rapidly build a clean, modern, and emotionally aligned UI that feels premium and intuitive for matchmakers. For data persistence, I utilized **MongoDB** with **Mongoose** to ensure strict schema validation for the rich customer profiles. **TypeScript** was heavily utilized to strictly enforce our 4-stage pipeline statuses (`New`, `Profile Shared`, `Active`, `Matched`) and prevent runtime errors. 

### Matching Logic
The algorithmic core (`lib/matching.ts`) implements realistic, gender-specific logic to score compatibility out of 100 points. When finding matches for **male clients**, the algorithm heavily weights traditional preferences, scoring women higher if they are younger (max 30 points), shorter, earn less, and share exact views on having children. For **female clients**, the algorithm takes a more thoughtful approach prioritizing lifestyle alignment, scoring matches higher based on professional/income compatibility (earning the same or more), relocation flexibility, shared dietary preferences, and value alignment.

### How AI is Used
AI is integrated directly into the workflow to reduce matchmaker friction. When a matchmaker identifies a high-potential match in the dashboard, they can trigger the **AI Intro Generator** (`/api/ai-intro`). This sends a highly contextual prompt—containing both profiles' lifestyles, professions, and values—to an LLM (OpenAI/Groq). The LLM processes this reasoning and instantly drafts a personalized, highly persuasive introduction email that the matchmaker can immediately send to the client.

### Assumptions Made
1. **Mock Data:** I assumed that populating the database with exactly 100+ dummy profiles (`data/clients.json`) via a `/api/seed` route would be the cleanest way to simulate a live matchmaking pool without requiring reviewers to manually create users.
2. **Heterosexual Matching MVP:** For the scope of this MVP, the algorithm assumes heterosexual matching, immediately filtering out same-gender profiles before running the intensive scoring logic.
3. **Pipeline Stages:** I assumed a simplified 4-stage operational funnel (`New` -> `Profile Shared` -> `Active` -> `Matched`) provides the most clarity for matchmakers tracking their roster.

---

## 🛠️ Setup & Installation

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment Variables:** Create a `.env` file and add your MongoDB URI and AI API keys.
4. **Seed the Database:** Run the development server and navigate to `/api/seed` to populate the initial dummy dataset.
5. **Run the App:**
   ```bash
   npm run dev
   ```

## 🔐 Ownership & License
This project was conceptualized, designed, and developed entirely by **Mohit Sen**. All modules, logic, and UI components are 100% original work submitted for project evaluation.
