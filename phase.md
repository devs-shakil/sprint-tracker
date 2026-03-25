# SprintTracker — Phase-wise Task List

**Stack:** React · Tailwind · Shadcn UI · Laravel · Inertia.js · Queue Workers · (Optional AI)

---

## Phase 1 — Project Setup & Public/Owner Views
> লক্ষ্য: Base project ready, owner can login, public can view projects

### Backend (Laravel)
- [ ] Laravel project init, `.env` config (DB, Mail, Queue)
- [ ] `users` table migration — role field: `owner` (only)
- [ ] Laravel Breeze auth setup (Owner login)
- [ ] Inertia.js install & configure
- [ ] Routes: Public index and show for projects

### Frontend (React + Inertia)
- [ ] React + Inertia + Tailwind + Shadcn UI setup
- [ ] Login page (Owner only)
- [ ] Public Projects Grid (`/projects`)
- [ ] Public Project Detail View
- [ ] Owner Dashboard (Project management)

---

## Phase 2 — Project Management (Owner)
> লক্ষ্য: Owner project create করতে পারবে, view public থাকবে

### Backend
- [ ] `projects` table — name, start_date, end_date, owner_id, status
- [ ] `segments` table — name, project_id (e.g. App, Web)
- [ ] CRUD API: Project (Owner only for create, update, delete)
- [ ] API: List all projects (Public)

### Frontend
- [ ] Project Grid View (Public) — name, dates, status
- [ ] Create project form (Owner only) — name, date range, segments
- [ ] Project detail page (Public) — segments, basic info
- [ ] Project detail page (Owner) — Edit/Delete options

---

## Phase 3 — Sprint Generator
> লক্ষ্য: Working days থেকে auto sprint তৈরি হবে

### Backend
- [ ] `working_days` table — project_id, date
- [ ] `sprints` table — project_id, sprint_number, start_date, end_date
- [ ] Service: `SprintGeneratorService`
  - [ ] Working days count করবে
  - [ ] Sprint duration থেকে sprint blocks তৈরি করবে
  - [ ] Last sprint remainder handle করবে
- [ ] API: Generate sprints for a project
- [ ] API: List sprints of a project

### Frontend
- [ ] Sprint preview UI (after project creation)
- [ ] Sprint list view — Sprint 1, Sprint 2... with date ranges
- [ ] Regenerate sprints button

---

## Phase 4 — Task Management
> লক্ষ্য: Owner tasks input করবে, segment অনুযায়ী organize হবে

### Backend
- [ ] `tasks` table — project_id, sprint_id, segment_id, assigned_to, title, description, priority, estimated_hours, status, day_number, order
- [ ] API: Bulk task input (owner pastes list per segment)
- [ ] API: CRUD single task
- [ ] Service: `TaskDistributorService`
  - [ ] Tasks segment অনুযায়ী group করবে
  - [ ] Sprints-এ evenly distribute করবে
  - [ ] Developer-এ assign করবে (round-robin per segment)
  - [ ] Day-wise task assign করবে

### Frontend
- [ ] Task input page per segment (textarea bulk input + parse)
- [ ] Task list edit UI (title, priority, estimated hours per task)
- [ ] Auto-distribute button → preview result
- [ ] Confirm & save distribution

---

## Phase 5 — Project current sprint daily view

### Backend
frontend e egula korar jonno ja lagbe
### Frontend
- [ ] Today task list depend on sprint
- [ ] Task card: title, priority badge, status chip, estimated time
- [ ] Sprint progress bar (done / total)
- [ ] Full sprint task list (collapsible by day)
- [ ] Mark task as "In Progress" manually

---

## Phase 6 — Git Integration (Webhook)
> লক্ষ্য: Commit করলে task auto-complete হবে

### Backend
- [ ] `git_commits` table — project_id, task_id, commit_hash, message, author, committed_at
- [ ] `POST /webhook/gitlab` endpoint (verify secret token)
- [ ] `POST /webhook/github` endpoint
- [ ] Service: `CommitParserService`
  - [ ] Commit message থেকে task reference extract করবে
  - [ ] Format support: `TASK-12`, `task: Title`, `[SP1-03]`
  - [ ] Fuzzy match by task title (optional)
- [ ] Task status → `completed` auto-update on match
- [ ] Store commit metadata linked to task

### Frontend
- [ ] Project settings page — Git webhook URL + secret key
- [ ] Per task: commit history (hash, message, author, time)
- [ ] Task card-এ "Completed via Git" badge

---

## Phase 7 — Owner Dashboard & Sprint View
> লক্ষ্য: Owner সব কিছু real-time দেখবে

### Backend
- [ ] API: Project overview stats (total, done, wip, pending)
- [ ] API: Sprint-wise task breakdown (per segment, per developer)
- [ ] API: Developer-wise progress

### Frontend
- [ ] Owner dashboard — stats cards (Total / Done / WIP / Pending)
- [ ] Overall progress bar
- [ ] Sprint table view (Sprint × Segment grid — like slide)
- [ ] Developer cards — task status list per dev
- [ ] Filter by sprint, segment, developer
- [ ] Task status color coding (✓ done, ⏳ wip, ● pending)

---

## Phase 8 — Notifications & Alerts
> লক্ষ্য: Overdue এবং deadline alerts যাবে

### Backend
- [ ] Queue Worker setup (Redis/database driver)
- [ ] Job: `DailyTaskReminderJob` — সকালে developer-দের আজকের task পাঠাবে
- [ ] Job: `OverdueTaskAlertJob` — task deadline miss হলে owner-কে notify করবে
- [ ] Job: `InactiveDevAlertJob` — X দিন কোনো commit নেই → alert
- [ ] Scheduler: `app/Console/Kernel.php`-এ schedule register
- [ ] Notification channels: Email (Laravel Mail) + optional Viber/SMS

### Frontend
- [ ] Notification bell icon (topbar)
- [ ] Notification list dropdown
- [ ] Notification settings page (on/off per type)

---

## Phase 9 — Auto Sprint Report (Email)
> লক্ষ্য: Sprint শেষে owner auto email পাবে

### Backend
- [ ] Job: `SprintEndReportJob` — sprint end date-এ trigger হবে
- [ ] Report content:
  - [ ] Completed tasks list (with commit links)
  - [ ] Incomplete tasks list (with assigned dev)
  - [ ] Per-developer summary
- [ ] Service: `TaskCarryOverService` — incomplete tasks → next sprint-এ move
- [ ] Email template (Laravel Mailable + Blade)
- [ ] API: Manual "Send Report Now" trigger

### Frontend
- [ ] Report preview page (owner)
- [ ] Sprint history list
- [ ] Each sprint-এ "View Report" button

---

## Phase 10 — AI Features (Optional)
> লক্ষ্য: AI দিয়ে task suggestion ও smart assignment

### Backend
- [ ] API: `POST /ai/suggest-tasks` — project description দিলে task list generate করবে
- [ ] API: `POST /ai/smart-assign` — developer workload বুঝে smart assignment করবে
- [ ] API: `POST /ai/estimate` — task description দিলে estimated hours suggest করবে
- [ ] Claude API / OpenAI integration (configurable)

### Frontend
- [ ] "Generate Tasks with AI" button (task input page)
- [ ] AI suggestion preview with accept/reject per task
- [ ] Smart assign toggle (AI mode vs manual)
- [ ] Estimate hours via AI button per task

---

## Phase 11 — Polish & Production
> লক্ষ্য: Deploy-ready, stable

### Backend
- [ ] API response standardize (success/error format)
- [ ] Form Request validation সব endpoint-এ
- [ ] Rate limiting (webhook, auth endpoints)
- [ ] Queue failed job handling + retry logic
- [ ] `.env.example` update

### Frontend
- [ ] Loading states সব page-এ
- [ ] Error boundary + 404/500 pages
- [ ] Toast notifications (Shadcn Toast)
- [ ] Mobile responsive check
- [ ] Dark mode support (Shadcn theme)

### DevOps
- [ ] Docker setup (optional)
- [ ] GitHub Actions CI (lint + test)
- [ ] Deploy guide (Forge / VPS)

---

## Summary Table

| Phase | Feature | Est. Days |
|-------|---------|-----------|
| 1 | Setup & Auth | 2 |
| 2 | Project & Team | 3 |
| 3 | Sprint Generator | 2 |
| 4 | Task Management | 4 |
| 5 | Developer Daily View | 2 |
| 6 | Git Webhook Integration | 3 |
| 7 | Owner Dashboard | 3 |
| 8 | Notifications & Alerts | 2 |
| 9 | Auto Sprint Report | 2 |
| 10 | AI Features (optional) | 3 |
| 11 | Polish & Production | 2 |
| **Total** | | **~28 days** |