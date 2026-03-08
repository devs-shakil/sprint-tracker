---
theme: seriph
background: https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80
title: SprintTracker – Automated Sprint Planning & Git Tracking
info: |
  ## SprintTracker
  Automated Agile Workflow System
  Sprint Planning · Git Tracking · Auto Reports
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="abs-tl m-8">
  <div class="text-xs opacity-50 uppercase tracking-widest font-bold">Sprint Tracker</div>
</div>

# Sprint Tracker

<div class="text-2xl opacity-80 mt-2 mb-6">Automated Sprint Planning & Git-Based Task Tracking</div>

<div class="grid grid-cols-3 gap-4 mt-8 text-sm">
  <div class="bg-white/10 rounded-xl p-3 backdrop-blur">🗂️ Auto Sprint Planning</div>
  <div class="bg-white/10 rounded-xl p-3 backdrop-blur">⚡ Git-Linked Tracking</div>
  <div class="bg-white/10 rounded-xl p-3 backdrop-blur">📊 Live Dashboard</div>
</div>

<div class="pt-10">
  <span @click="$slidev.nav.next" class="px-4 py-2 rounded-full bg-blue-500/30 border border-blue-400/40 cursor-pointer hover:bg-blue-500/50 transition text-sm">
    Start Presentation →
  </span>
</div>

---
layout: center
class: text-center
transition: fade-out
---

# The Problem We're Solving

<div class="grid grid-cols-2 gap-6 mt-8 text-left max-w-3xl mx-auto">

<div v-click class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
  <div class="text-red-400 font-bold mb-2">😩 Manual Sprint Planning</div>
  <div class="text-sm opacity-80">Team leads spend hours every month manually dividing tasks into sprints and assigning developers. Tedious and error-prone.</div>
</div>

<div v-click class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
  <div class="text-red-400 font-bold mb-2">🔍 No Real-Time Tracking</div>
  <div class="text-sm opacity-80">No clear visibility on who is doing what, what is done, and what is pending — until someone manually updates a spreadsheet.</div>
</div>

<div v-click class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
  <div class="text-red-400 font-bold mb-2">🔀 Git & Tasks are Disconnected</div>
  <div class="text-sm opacity-80">Developers commit code but task boards never update automatically. Status updates require manual effort.</div>
</div>

<div v-click class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
  <div class="text-red-400 font-bold mb-2">📧 Manual Reporting</div>
  <div class="text-sm opacity-80">Project owners must chase developers for updates. End-of-sprint reports are written manually and often delayed.</div>
</div>

<div v-click class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
  <div class="text-red-400 font-bold mb-2">😶 Poor Owner Visibility</div>
  <div class="text-sm opacity-80">Project owners have zero live insight into progress. They depend on meetings and Viber messages that get lost.</div>
</div>

<div v-click class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
  <div class="text-red-400 font-bold mb-2">📅 Plans Forgotten Over Time</div>
  <div class="text-sm opacity-80">Monthly plans exist only in someone's head or a document. Everyday task clarity is missing — devs are confused what to do next.</div>
</div>

</div>

---
layout: center
class: text-center
transition: fade
---
<!-- 
# ✅ SprintFlow Solves All of This

<div class="grid grid-cols-3 gap-5 mt-8 text-left max-w-4xl mx-auto">

<div v-click class="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
  <div class="text-3xl mb-2">🤖</div>
  <div class="text-green-400 font-bold mb-1">Auto Sprint Generation</div>
  <div class="text-xs opacity-75">Input tasks once → system auto-distributes into sprints and assigns developers evenly</div>
</div>

<div v-click class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
  <div class="text-3xl mb-2">⚡</div>
  <div class="text-blue-400 font-bold mb-1">Git Commit → Task Done</div>
  <div class="text-xs opacity-75">Commit with a task reference and the dashboard updates automatically. Zero manual status update</div>
</div>

<div v-click class="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
  <div class="text-3xl mb-2">📊</div>
  <div class="text-purple-400 font-bold mb-1">Live Dashboard</div>
  <div class="text-xs opacity-75">Project owners see real-time sprint status, developer progress and burndown charts anytime</div>
</div>

<div v-click class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
  <div class="text-3xl mb-2">📅</div>
  <div class="text-yellow-400 font-bold mb-1">Daily Task Planner</div>
  <div class="text-xs opacity-75">Every developer knows exactly what to work on today — no confusion, no meetings needed</div>
</div>

<div v-click class="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
  <div class="text-3xl mb-2">📩</div>
  <div class="text-orange-400 font-bold mb-1">Auto Email Reports</div>
  <div class="text-xs opacity-75">Sprint deadline hits → owner gets a full report with completed tasks, failures, and commit links</div>
</div>

<div v-click class="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4">
  <div class="text-3xl mb-2">🔔</div>
  <div class="text-teal-400 font-bold mb-1">Smart Notifications</div>
  <div class="text-xs opacity-75">Alerts for overdue tasks, inactive developers, and sprint deadlines — sent to Viber/Email automatically</div>
</div> -->

<!-- </div> -->

<!-- ---
layout: default
transition: slide-up -->
<!-- --- -->
# Project Input Flow

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

### Project Owner Creates a Project

<v-clicks depth="2">

1. **Project Name** — e.g. "Ecommerce Store"
2. **Start & End Date** — e.g. April 1 → April 30
3. **Working Days** — Pick from calendar (select custom working days)
4. **Total Developers** — e.g. 3 developers
5. **Sprint Duration** — Auto-calculated from working days
6. **Segments / Teams** — e.g. App, Web, Admin API

</v-clicks>

</div>

<div v-click>

### Auto-Generated Result

```
Project: Ecommerce Store
Month:   April 2025
Working Days: 22 days
Developers: 3

─────────────────────────────
Sprint 1 → April 1  – April 8  (6 days)
Sprint 2 → April 9  – April 16 (6 days)
Sprint 3 → April 17 – April 24 (6 days)
Sprint 4 → April 25 – April 30 (4 days)
─────────────────────────────
Total Sprints: 4
```

</div>

</div>

---
layout: default
transition: slide-up
---

# Task Input System

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

### Owner Inputs Task List (per Segment)

```
📱 App Tasks
1. Bottom navigation setup
2. Home screen layout
3. Product listing page
4. Product details page
5. Cart functionality
6. Checkout flow
7. Order success screen

🌐 Web Tasks
1. Homepage UI
2. Category page
3. Product page
4. Search results

⚙️ Admin API
1. Product CRUD API
2. Order management API
3. User auth API
```

</div>

<div>

### Optional Fields per Task

<v-clicks>

- **Title** — Short descriptive name
- **Description** — Full details of what to build
- **Priority** — 🔴 High / 🟡 Medium / 🟢 Low
- **Estimated Time** — Hours or story points
- **Segment** — App / Web / Admin / API

</v-clicks>

<div v-click class="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-sm">
  ✅ Tasks are grouped by segment and then distributed into sprints automatically
</div>

</div>

</div>

---
layout: center
class: text-center
transition: fade
---

# ⚡ Automatic Sprint Generator

<div class="grid grid-cols-3 gap-6 mt-8 text-left max-w-4xl mx-auto">

<div v-click class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
  <div class="text-4xl text-center mb-3">📅</div>
  <div class="font-bold text-blue-300 mb-2">Step 1: Count Working Days</div>
  <div class="text-sm opacity-80">System counts non-holiday, non-weekend days selected by the owner on the calendar</div>
  <div class="mt-3 text-xs bg-black/20 rounded p-2">April → 22 working days selected</div>
</div>

<div v-click class="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
  <div class="text-4xl text-center mb-3">🔀</div>
  <div class="font-bold text-purple-300 mb-2">Step 2: Generate Sprints</div>
  <div class="text-sm opacity-80">Based on sprint duration preference, system auto-creates sprint blocks covering the full month</div>
  <div class="mt-3 text-xs bg-black/20 rounded p-2">22 days ÷ 5 = 4 sprints (last sprint may vary)</div>
</div>

<div v-click class="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
  <div class="text-4xl text-center mb-3">👥</div>
  <div class="font-bold text-green-300 mb-2">Step 3: Assign Tasks</div>
  <div class="text-sm opacity-80">Tasks are distributed evenly across developers per sprint, respecting segment ownership</div>
  <div class="mt-3 text-xs bg-black/20 rounded p-2">Dev A → 7 tasks, Dev B → 7 tasks, Dev C → 6 tasks</div>
</div>

</div>

<div v-click class="mt-8 text-sm opacity-75">
  🔄 If tasks are incomplete, they carry over to the next sprint automatically
</div>

---
layout: default
transition: slide-left
---

# Day-Wise Task Planner

Each developer knows exactly what to do every day

<div class="mt-4 text-sm">

| Day | 👨‍💻 Dev A (App) | 👨‍💻 Dev B (Web) | 👨‍💻 Dev C (API) |
|-----|----------------|----------------|----------------|
| **Day 1** | Bottom navigation setup,</br> Top navigation setup | Homepage UI layout | Product CRUD API |
| **Day 2** | Home screen layout | Category page design | Order management API |
| **Day 3** | Product listing page | Product page design | User auth API |
| **Day 4** | Product details page | Search results page | Cart API endpoints |
| **Day 5** | Cart functionality | Payment UI integration | Payment gateway API |
| **Day 6** | Checkout flow | Checkout page design | Order status API |

</div>

<div v-click class="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm text-center">
  📱 Developers see this in their personal dashboard — no ambiguity about what to work on each day
</div>

---
layout: default
transition: slide-up
---

# Git Integration — How It Works

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

### Developer Makes a Commit

```bash
# Option 1: Task title reference
git commit -m "task: Homepage UI completed"

# Option 2: Task ID reference  
git commit -m "TASK-12 Cart functionality done"

# Option 3: Sprint + Task reference
git commit -m "[SP1-03] Product listing page done"
```

<v-click>

### GitLab / GitHub Webhook

```
Commit pushed → Webhook fires →
Backend receives payload →
Parse task reference from message →
Match with task in database →
Update task status to ✅ Completed
```

</v-click>

</div>

<div>

<v-clicks>

### Task Status Updates Automatically

<div class="mt-4 space-y-3 text-sm">

<div class="flex items-center gap-3 p-3 bg-gray-500/10 rounded-lg">
  <span class="text-2xl">⏳</span>
  <div>
    <div class="font-bold text-gray-300">Pending</div>
    <div class="opacity-60">Task assigned, no commit yet</div>
  </div>
</div>

<div class="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
  <span class="text-2xl">🔨</span>
  <div>
    <div class="font-bold text-yellow-300">In Progress</div>
    <div class="opacity-60">Commit detected, not marked done</div>
  </div>
</div>

<div class="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
  <span class="text-2xl">✅</span>
  <div>
    <div class="font-bold text-green-300">Completed</div>
    <div class="opacity-60">Task-reference commit found → auto-closed</div>
  </div>
</div>

</div>

</v-clicks>

</div>

</div>

---
layout: default
transition: slide-left
---

# Sprint Dashboard 

<div class="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f1117] text-sm">

<!-- Top bar -->
<div class="flex items-center gap-4 px-5 py-3 bg-[#161b27] border-b border-white/10">
  <div class="text-white font-bold">🗂️ Ecommerce Store</div>
  <div class="ml-auto flex gap-3 text-xs opacity-60">
    <span class="text-white">Deadline: April 2025</span>
    <span class="text-green-400">● Live</span>
  </div>
</div>

<!-- Stats Row -->
<div class="grid grid-cols-4 gap-3 p-4">
  <div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
    <div class="text-2xl font-bold text-blue-300">24</div>
    <div class="text-xs opacity-60 mt-1 text-white">Total Tasks</div>
  </div>
  <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
    <div class="text-2xl font-bold text-white">14</div>
    <div class="text-xs opacity-60 mt-1 text-white">Completed</div>
  </div>
  <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
    <div class="text-2xl font-bold text-yellow-300">7</div>
    <div class="text-xs opacity-60 mt-1 text-white">In Progress</div>
  </div>
  <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
    <div class="text-2xl font-bold text-red-300">3</div>
    <div class="text-xs opacity-60 mt-1 text-white">Pending</div>
  </div>
</div>

<!-- Progress -->
<div class="px-4 pb-3">
  <div class="flex justify-between text-xs mb-1 opacity-60">
    <span>Overall Sprint Progress</span><span>58%</span>
  </div>
  <div class="bg-white/10 rounded-full h-2">
    <div class="bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded-full" style="width:58%"></div>
  </div>
</div>

</div>

<div class="grid grid-cols-3 gap-4 mt-4 text-xs">
  <div v-click class="bg-white/5 border border-white/10 rounded-lg p-3">
    <div class="font-bold mb-2">👨‍💻 Dev A — App</div>
    <div class="space-y-1">
      <div class="flex justify-between"><span class="opacity-70">Bottom Nav</span><span class="text-green-400">✓ Done</span></div>
      <div class="flex justify-between"><span class="opacity-70">Home Screen</span><span class="text-green-400">✓ Done</span></div>
      <div class="flex justify-between"><span class="opacity-70">Product List</span><span class="text-yellow-400">⏳ WIP</span></div>
    </div>
  </div>
  <div v-click class="bg-white/5 border border-white/10 rounded-lg p-3">
    <div class="font-bold mb-2">👨‍💻 Dev B — Web</div>
    <div class="space-y-1">
      <div class="flex justify-between"><span class="opacity-70">Homepage UI</span><span class="text-green-400">✓ Done</span></div>
      <div class="flex justify-between"><span class="opacity-70">Category Page</span><span class="text-green-400">✓ Done</span></div>
      <div class="flex justify-between"><span class="opacity-70">Product Page</span><span class="text-red-400">● Pending</span></div>
    </div>
  </div>
  <div v-click class="bg-white/5 border border-white/10 rounded-lg p-3">
    <div class="font-bold mb-2">👨‍💻 Dev C — API</div>
    <div class="space-y-1">
      <div class="flex justify-between"><span class="opacity-70">Product API</span><span class="text-green-400">✓ Done</span></div>
      <div class="flex justify-between"><span class="opacity-70">Order API</span><span class="text-green-400">✓ Done</span></div>
      <div class="flex justify-between"><span class="opacity-70">Auth API</span><span class="text-yellow-400">⏳ WIP</span></div>
    </div>
  </div>
</div>

---
layout: default
transition: slide-up
---

# Project Sprint View 

<div class="mt-2 rounded-xl overflow-hidden border  border-gray-300 text-xs shadow-sm  bg-gray-200">

<!-- Sprint Header -->
<div class="grid grid-cols-5  border-b  border-gray-300 font-bold text-center py-2 px-2">
  <div>Sprint</div>
  <div>🌐 Frontend</div>
  <div>⚙️ API</div>
  <div>🛡️ Admin Panel</div>
  <div>📱 App</div>
</div>

<!-- Sprint 1 -->
<div class="grid grid-cols-5 border-b  border-gray-300">
  <div class="p-3 border-r  border-gray-300 ">
    <div class="font-bold ">Sprint 1</div>
    <div class="opacity-50 mt-1">Apr 1–8 · 6 days</div>
  </div>
  <div class="p-3 border-r border-gray-300 space-y-1 ">
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Category listing page</span></div>
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Brand listing page</span></div>
    <div class="flex gap-1 items-center"><span class="text-yellow-400">⏳</span> <span>Search results page</span></div>
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Basic SEO structure</span></div>
  </div>
  <div class="p-3 border-r border-gray-300 space-y-1">
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Flash deals API</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Category filter</span></div>
    <div class="flex gap-1 items-center"><span class="text-yellow-400">⏳</span> <span>Product variant</span></div>
  </div>
  <div class="p-3 border-r border-gray-300 space-y-1">
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Variant system</span></div>
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Color image field</span></div>
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Home page manage</span></div>
  </div>
  <div class="p-3 space-y-1">
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Bottom Menu Drawer</span></div>
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Home Page</span></div>
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Flash Deals</span></div>
    <div class="flex gap-1 items-center"><span class="">✓</span> <span class="line-through opacity-50">Video Reels</span></div>
  </div>
</div>

<!-- Sprint 2 -->
<div class="grid grid-cols-5 border-b border-gray-300">
  <div class="p-3 border-r border-gray-300 bg-purple-500/5">
    <div class="font-bold text-purple-300">Sprint 2</div>
    <div class="opacity-50 mt-1">Apr 9–16 · 6 days</div>
  </div>
  <div class="p-3 border-r border-gray-300 space-y-1">
    <div class="flex gap-1 items-center"><span class="text-green-400">✓</span> <span class="line-through opacity-50">Product info section</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Product Gallery</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Product variant UI</span></div>
    <div class="flex gap-1 items-center"><span class="text-green-400">✓</span> <span class="line-through opacity-50">Product reviews</span></div>
  </div>
  <div class="p-3 border-r border-gray-300 space-y-1">
    <div class="flex gap-1 items-center"><span class="text-green-400">✓</span> <span class="line-through opacity-50">Search API merge</span></div>
    <div class="flex gap-1 items-center"><span class="text-green-400">✓</span> <span class="line-through opacity-50">Product variant API</span></div>
  </div>
  <div class="p-3 border-r border-gray-300 space-y-1">
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Variant system fix</span></div>
  </div>
  <div class="p-3 space-y-1">
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Search product page</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Product details</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Brand Page</span></div>
  </div>
</div>

<!-- Sprint 3 -->
<div class="grid grid-cols-5">
  <div class="p-3 border-r border-white/10 bg-green-500/5">
    <div class="font-bold text-green-300">Sprint 3</div>
    <div class="opacity-50 mt-1">Apr 17–24 · 6 days</div>
  </div>
  <div class="p-3 border-r border-white/10 space-y-1">
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Checkout address</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Payment gateway</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Order success page</span></div>
  </div>
  <div class="p-3 border-r border-white/10 opacity-40 italic text-center pt-6">—</div>
  <div class="p-3 border-r border-white/10 opacity-40 italic text-center pt-6">—</div>
  <div class="p-3 space-y-1">
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Tag product page</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>Category page</span></div>
    <div class="flex gap-1 items-center"><span class="text-red-400">●</span> <span>App Deep Link</span></div>
  </div>
</div>

</div>

---
layout: default
transition: slide-left
---

# Real-Time Dashboard — Developer View

<div class="mt-4 rounded-xl overflow-hidden border border-white/10 bg-gray-200 text-sm">

<div class="flex items-center gap-4 px-5 py-3 bg-[#161b27] border-b border-white/10">
  <div class="text-white font-bold">👨‍💻 Dev A's Dashboard — Sprint 2</div>
  <div class="ml-auto text-xs text-green-400">● Connected to Git</div>
</div>

<div class="grid grid-cols-2 gap-4 p-4">

  <div>
    <div class="text-xs opacity-50 uppercase tracking-wider mb-2">Today's Tasks — Day 3</div>
    <div class="space-y-2">
      <div class="flex items-center gap-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <span class="text-green-400 text-lg">✓</span>
        <div>
          <div class="font-medium">Product listing page</div>
          <div class="text-xs opacity-50">Committed 2h ago · TASK-07</div>
        </div>
      </div>
      <div class="flex items-center gap-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <span class="text-yellow-400 text-lg">🔨</span>
        <div>
          <div class="font-medium">Product details page</div>
          <div class="text-xs opacity-50">In progress · No commit yet</div>
        </div>
      </div>
      <div class="flex items-center gap-3 p-2 bg-gray-500/10 border border-white/10 rounded-lg">
        <span class="opacity-50 text-lg">⏳</span>
        <div>
          <div class="font-medium opacity-60">Cart functionality</div>
          <div class="text-xs opacity-40">Scheduled for tomorrow</div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="text-xs opacity-50 uppercase tracking-wider mb-2">Sprint 2 Progress</div>
    <div class="space-y-2 text-xs">
      <div>
        <div class="flex justify-between mb-1"><span>Tasks Done</span><span class="text-green-400">4 / 9</span></div>
        <div class="bg-white/10 rounded-full h-1.5">
          <div class="bg-green-400 h-1.5 rounded-full" style="width:44%"></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between mb-1"><span>Days Elapsed</span><span class="text-blue-400">3 / 6</span></div>
        <div class="bg-white/10 rounded-full h-1.5">
          <div class="bg-blue-400 h-1.5 rounded-full" style="width:50%"></div>
        </div>
      </div>
      <div class="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
        <div class="text-orange-300 font-bold">⚠️ Behind Schedule</div>
        <div class="opacity-60 mt-1">Sprint ends in 3 days. 5 tasks remaining.</div>
      </div>
    </div>
  </div>

</div>

</div>

<div v-click class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-center">
  🔗 Every task links to the Git commit that completed it — full traceability for project owners
</div>

---
layout: default
transition: slide-up
---

# Automatic Email & Viber Report

When a sprint deadline is reached, the system sends this report automatically:

<div class="mt-4 rounded-xl overflow-hidden border border-white/10 bg-gray-200 text-xs shadow-xl">

<div class="px-5 py-3 bg-[#161b27] border-b border-white/10 flex justify-between items-center">
  <div>
    <div class="text-white font-bold">📧 Sprint 1 Report — Ecommerce Store</div>
    <div class="opacity-50 mt-0.5 text-gray-100" >Sent automatically on April 8, 2025 at 11:59 PM</div>
  </div>
  
</div>

<div class="p-5 grid grid-cols-2 gap-4">

<div>
  <div class="text-green-400 font-bold mb-2 uppercase tracking-wider">✅ Completed Tasks (8/11)</div>
  <ul class="space-y-1 list-disc">
    <li class="flex items-center gap-2"><span class="w-1 h-1 bg-gray rounded-full"></span><span>Category listing page</span></li>
    <li class="flex items-center gap-2 "><span class="w-1 h-1 bg-gray rounded-full"></span><span>Brand listing page</span></li>
    <li class="flex items-center gap-2 "><span class="w-1 h-1 bg-gray rounded-full"></span><span>Homepage UI layout</span></li>
    <li class="flex items-center gap-2 "><span class="w-1 h-1 bg-gray rounded-full"></span><span>Product variant API</span></li>
    <li class="flex items-center gap-2 "><span class="w-1 h-1 bg-gray rounded-full"></span><span>Color image attribute</span></li>
    <li class="flex items-center gap-2 "><span class="w-1 h-1 bg-gray rounded-full"></span><span>Bottom Menu Drawer</span></li>
    <li class="flex items-center gap-2 "><span class="w-1 h-1 bg-gray rounded-full"></span><span>Flash Deals App</span></li>
    <li class="flex items-center gap-2 "><span class="w-1 h-1 bg-gray rounded-full"></span><span>Home Page App</span></li>
  </ul>
</div>

<div>
  <div class="text-red-400 font-bold mb-2 uppercase tracking-wider">❌ Incomplete Tasks (3/11)</div>
  <div class="space-y-1 mb-4">
    <div class="flex justify-between p-1.5 bg-red-500/5 rounded"><span>Search results page</span><span class="opacity-50">Dev B</span></div>
    <div class="flex justify-between p-1.5 bg-red-500/5 rounded"><span>Flash deals API</span><span class="opacity-50">Dev C</span></div>
    <div class="flex justify-between p-1.5 bg-red-500/5 rounded"><span>Category filter API</span><span class="opacity-50">Dev C</span></div>
  </div>
  <!-- <div class="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
    <div class="text-yellow-300 font-bold mb-1">🔄 Carried to Sprint 2</div>
    <div class="opacity-60">3 incomplete tasks automatically moved to Sprint 2 planning</div>
  </div> -->
  <div class="mt-3 flex flex-col gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
    <a class="text-blue-400 cursor-pointer hover:text-blue-500 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">→ View Full Dashboard</a>
    <a class="text-blue-400 cursor-pointer hover:text-blue-500 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">→ View Site Preview</a>
  </div>
</div>

</div>

</div>

---
layout: center
class: text-center
transition: fade
---


# Key Benefits Summary

<div class="grid grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto text-left text-sm">

<div v-click class="flex gap-3 items-start p-4 bg-white/5 rounded-xl border border-white/10">
  <span class="text-2xl">⚡</span>
  <div>
    <div class="font-bold">80% Less Planning Time</div>
    <div class="opacity-60 text-xs mt-1">Sprints and task assignments generated in seconds, not hours</div>
  </div>
</div>

<div v-click class="flex gap-3 items-start p-4 bg-white/5 rounded-xl border border-white/10">
  <span class="text-2xl">🎯</span>
  <div>
    <div class="font-bold">Zero Manual Status Updates</div>
    <div class="opacity-60 text-xs mt-1">Git commits drive all task status changes — no Jira, no Trello, no spreadsheets</div>
  </div>
</div>

<div v-click class="flex gap-3 items-start p-4 bg-white/5 rounded-xl border border-white/10">
  <span class="text-2xl">👀</span>
  <div>
    <div class="font-bold">Full Owner Visibility</div>
    <div class="opacity-60 text-xs mt-1">Live dashboard anytime — know exactly what's done and what's pending</div>
  </div>
</div>

<div v-click class="flex gap-3 items-start p-4 bg-white/5 rounded-xl border border-white/10">
  <span class="text-2xl">📩</span>
  <div>
    <div class="font-bold">Automated Reports</div>
    <div class="opacity-60 text-xs mt-1">End-of-sprint emails with commit links sent without anyone pressing a button</div>
  </div>
</div>

<div v-click class="flex gap-3 items-start p-4 bg-white/5 rounded-xl border border-white/10">
  <span class="text-2xl">📅</span>
  <div>
    <div class="font-bold">Daily Clarity for Devs</div>
    <div class="opacity-60 text-xs mt-1">Every developer knows exactly what to do every day, no meetings needed</div>
  </div>
</div>

<div v-click class="flex gap-3 items-start p-4 bg-white/5 rounded-xl border border-white/10">
  <span class="text-2xl">🔄</span>
  <div>
    <div class="font-bold">Nothing Gets Lost</div>
    <div class="opacity-60 text-xs mt-1">Incomplete tasks auto-carry to next sprint — no task falls through the cracks</div>
  </div>
</div>

</div>

