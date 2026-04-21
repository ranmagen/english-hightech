# TechSpace — CLAUDE.md

## Project Overview
TechSpace is an English-language simulation playground for Israeli middle school students (grades 7–9). Students play the role of a Product Manager (PM) at a global tech company, communicating in English with AI agents.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **AI Engine**: Anthropic SDK (`claude-sonnet-4-20250514`)
- **Database**: Supabase (Postgres)
- **Routing**: React Router v6

## Project Structure
```
src/
├── agents/
│   ├── prompts/          # System prompts per agent (sarah.ts, mark.ts, etc.)
│   └── AgentEngine.ts    # API call handler + response parser
├── scenarios/
│   ├── library/          # JSON files for each scenario (B-01.json, etc.)
│   └── ScenarioEngine.ts # Branch logic, goal tracking, completion detection
├── evaluation/
│   ├── rubric.ts         # Evaluation criteria definitions
│   └── EvaluationEngine.ts # Post-scenario Claude evaluation call
├── components/
│   ├── Chat/             # Slack-style chat UI with agent avatars
│   ├── GlossaryTooltip/  # Hover tooltip with Hebrew definitions
│   ├── ScoreScreen/      # Radar chart + feedback display (recharts)
│   ├── PresentationMode/ # Slide builder + timer + Q&A
│   └── Admin/            # Admin panel components
├── pages/
│   ├── Home.tsx          # Scenario selection grid
│   ├── Scenario.tsx      # Active scenario view
│   └── admin/AdminPage.tsx # Admin routes
├── data/
│   └── glossary.ts       # 26 glossary terms with Hebrew definitions
└── lib/
    ├── supabase.ts       # DB client + TypeScript types
    └── anthropic.ts      # Anthropic client (dangerouslyAllowBrowser)
```

## Environment Variables
Copy `.env.example` to `.env` and fill in:
```
VITE_ANTHROPIC_API_KEY=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_PASSWORD=techspace2025
```

## Scenarios
| ID   | Title                    | Level        | Agents               |
|------|--------------------------|--------------|----------------------|
| B-01 | Monday Standup           | Beginner     | Sarah, Jamie         |
| B-02 | Feature Request Email    | Beginner     | Tom                  |
| I-01 | Sprint Review Gone Wrong | Intermediate | Mark, Sarah          |
| I-02 | Cross-Cultural Conflict  | Intermediate | Priya, Sarah         |
| A-01 | Board Pitch              | Advanced     | Mark, Tom            |
| A-02 | Budget Cut Crisis        | Advanced     | Mark, Sarah, Priya, Tom |

## Agents
- **Sarah Lee** — Engineering Lead, direct/technical, pushes back on vague requirements
- **Mark Kim** — VP Product, formal/strategic, KPI-focused
- **Priya Rao** — UX Design Partner, collaborative/thoughtful, user-focused
- **Tom Carter** — Enterprise Client, formal/impatient, ROI-focused
- **Jamie Walsh** — Junior Developer, casual/enthusiastic, asks clarifying questions

## Key Design Decisions
- `dangerouslyAllowBrowser: true` in Anthropic client — acceptable for educational MVP
- Vocabulary tracking uses client-side regex matching against GLOSSARY_TERMS
- Scenario completion is detected via min vocabulary terms + avg agent satisfaction + message count
- Admin panel auth uses `sessionStorage` + env var password (MVP-level security)
- Hebrew appears ONLY in: glossary tooltips, admin sidebar labels, level badges
- No translation button — English-first by design

## Database
Run migrations in `supabase/migrations/` order:
1. `001_initial_schema.sql` — creates all tables
2. `002_seed_scenarios.sql` — seeds the 6 scenarios + 22 glossary terms

## Admin Panel
Route: `/admin`
Password: `techspace2025` (configurable via `VITE_ADMIN_PASSWORD`)
Features: Performance Dashboard, Scenario Creator, Agent Editor, Glossary Manager

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```
