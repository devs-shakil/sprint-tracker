# SprintTracker — Phase-wise Task List

## Phase 1 - Project Details Sprint View (Dynamic)
> লক্ষ্য: Sprint-wise task list দেখা যাবে, নতুন task add করা যাবে এবং task completion toggle করা যাবে।

### ✅ Implemented
- [x] Sprint grid layout structure
- [x] Sprint generation logic (6 days per sprint)
- [x] Working days calculation (excluding Fri-Sat)

### ⏳ In Progress
- [ ] **Interactive Sprint Grid**: `phase.md`-এ দেখানো mockup-এর মতো dynamic grid তৈরি করা।
- [ ] **Quick Task Add**: প্রতিটা segment (Frontend, API, etc.) এবং sprint-এর intersection থেকে সরাসরি task add করা।
- [ ] **Status Toggle**: Task-এ ক্লিক করলে status `todo` থেকে `completed` হবে (সরাসরি line-through effect দেখা যাবে)।
- [ ] **Real-time Updates**: Status change করলে backend-এ auto-save হবে।

---

## Phase 2 - Project Management & Monitoring 
> লক্ষ্য: সব প্রোজেক্টের লাইভ স্ট্যাটাস প্রোজেক্ট কার্ডের মধ্যে দেখা যাবে।

### ✅ Implemented
- [x] Dashboard view with project cards
- [x] Project creation with segments and date range
- [x] Team member assignment (Developer to Segment)
- [x] Project overview stats (Duration, Working Days, Sprints)

---

## Phase 3 — Sprint Distribution & Git Integration
> লক্ষ্য: Commit করলে task auto-complete হবে এবং task-গুলো sprints-এ distribute করা যাবে।

### Backend
- [x] `TaskDistributorService`: Tasks-কে automatically sprints এবং developers-দের মধ্যে বণ্টন করা।
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

## Phase 4 — Detailed Dashboard & Real-time Monitoring
> লক্ষ্য:  সব কিছু real-time দেখবে

### Backend
- [ ] API: Project overview stats (total, done, wip, pending)
- [ ] API: Sprint-wise task breakdown (per segment, per developer)
- [ ] API: Developer-wise progress

### Frontend
- [ ] dashboard — stats cards (Total / Done / WIP / Pending)
- [ ] Overall progress bar
- [ ] Sprint table view (Sprint × Segment grid — like slide)
- [ ] Developer cards — task status list per dev
- [ ] Filter by sprint, segment, developer
- [ ] Task status color coding (✓ done, ⏳ wip, ● pending)

---


## Phase 5 — Monthly base pdf report
> লক্ষ্য: Monthly base pdf report generate হবে

### Backend
- [ ] Job: `MonthlyReportJob` — sprint end date-এ trigger হবে
- [ ] Report content:
  - [ ] Completed tasks list (with commit links)
  - [ ] Incomplete tasks list (with assigned dev)
  - [ ] Per-developer summary
- [ ] Service: `TaskCarryOverService` — incomplete tasks → next sprint-এ move
- [ ] API: Manual "Send Report Now" trigger

### Frontend
- [ ] Report preview page (owner)
- [ ] Sprint history list
- [ ] Each sprint-এ "View Report" button

---

## Phase 6 — AI Features (Optional)
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
