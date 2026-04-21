-- Seed built-in scenarios from JSON definitions

insert into public.scenarios (id, title, level, agents, goal, context_doc, hint, success_criteria, branches, is_published, unlock_requires, opening_message, opening_agent, writing_mode)
values
  (
    'B-01', 'Monday Standup', 'beginner',
    array['sarah', 'jamie'],
    'Deliver a clear status update covering what you completed, what you''re working on, and any blockers. Answer 2 follow-up questions clearly.',
    null,
    'In a standup, always cover 3 things: what you completed, what you''re working on now, and any blockers (problems stopping you). Keep it short and clear!',
    '{"goal_achieved": true, "min_vocabulary_terms": 3, "agent_satisfaction_score": 3}'::jsonb,
    '[{"trigger": "vague_update", "agent_response": "sarah_pushback", "consequence": "score_penalty"}, {"trigger": "clear_three_part_update", "agent_response": "sarah_positive", "consequence": "bonus_points"}]'::jsonb,
    true, '{}',
    'Good morning! Ready for our Monday standup. Who wants to go first? PM, what''s your update?',
    'sarah', 'chat'
  ),
  (
    'B-02', 'Feature Request Email', 'beginner',
    array['tom'],
    'Write a professional email reply to Tom Carter acknowledging his feature request, explaining the process, and setting realistic expectations with a timeline.',
    E'Email from Tom Carter:\n\nSubject: URGENT — Dashboard Export Feature\n\nOur team has been waiting 3 months for the data export feature in the dashboard. We were promised this in Q3 and it is now Q4. We have 200 users who cannot export their reports. This is affecting our operations.\n\nI need a timeline and a responsible person to contact. This is unacceptable.\n\nBest regards,\nTom Carter\nIT Manager, GlobalCorp',
    'Write a professional email with: 1) Acknowledge Tom''s frustration, 2) Apologize for the delay, 3) Give a specific timeline and next steps, 4) Provide a contact name. Use formal language!',
    '{"goal_achieved": true, "min_vocabulary_terms": 2, "agent_satisfaction_score": 3}'::jsonb,
    '[]'::jsonb,
    true, '{}',
    'I am waiting for your response to my email about the dashboard export feature. This has been unacceptable. What do you have to say?',
    'tom', 'email'
  ),
  (
    'I-01', 'Sprint Review Gone Wrong', 'intermediate',
    array['mark', 'sarah'],
    'Communicate a sprint delay to Mark Kim professionally, explain the root cause, provide a recovery plan, and manage his expectations without losing his trust.',
    E'SPRINT 12 STATUS REPORT\n\nOriginal deadline: End of this week (Friday)\nCurrent completion: 60%\nRemaining tasks: 4 features, 2 bug fixes\n\nRoot causes:\n- Critical API compatibility issue (3 days lost)\n- New compliance requirement added mid-sprint\n- One developer sick for 4 days\n\nProposed new timeline: +8 business days\nKPIs at risk: Q4 launch target, client satisfaction score',
    'Start with the bad news clearly, then explain why (root causes), then offer your recovery plan with specific dates. Don''t apologize too much — be professional and solution-focused.',
    '{"goal_achieved": true, "min_vocabulary_terms": 4, "agent_satisfaction_score": 3}'::jsonb,
    '[]'::jsonb,
    true, '{"B-01"}',
    'I''ve been looking at the sprint dashboard and the numbers don''t look good. Explain what''s happening and what you''re doing about it.',
    'mark', 'chat'
  ),
  (
    'I-02', 'Cross-Cultural Conflict', 'intermediate',
    array['priya', 'sarah'],
    'Mediate a design disagreement between Priya and Sarah. Help both sides feel heard, find common ground, and propose a decision that moves the project forward.',
    E'CONFLICT SUMMARY\n\nThe Issue: Mobile checkout redesign\n\nPriya''s position (UX):\n- Wants 3 new user confirmation steps (reduce errors)\n- Research: 23% of users make mistakes in current flow\n\nSarah''s position (Engineering):\n- 3 steps require 2 additional API calls = 400ms slowdown\n- Proposes: fix 1 most common error only, ship on schedule\n\nCurrent status: Sprint planning blocked.',
    'As PM, your job is to help both sides feel heard. Start by summarizing each person''s concern, then propose a compromise solution.',
    '{"goal_achieved": true, "min_vocabulary_terms": 4, "agent_satisfaction_score": 3}'::jsonb,
    '[]'::jsonb,
    true, '{"B-02"}',
    'I''ve reviewed the wireframes and I have serious concerns. The new checkout flow doesn''t consider our users with slower connections at all.',
    'priya', 'chat'
  ),
  (
    'A-01', 'Board Pitch', 'advanced',
    array['mark', 'tom'],
    'Deliver a 5-minute product pitch presenting a new AI-powered analytics feature. Build 3–5 slides, present clearly, and handle 3 live Q&A questions from Mark and Tom.',
    E'PRODUCT: SmartInsights — AI Analytics Dashboard\n\nKey Features:\n- Real-time data visualization with AI summaries\n- Predictive alerts before KPIs drop\n- Natural language queries\n\nMarket data:\n- 78% of enterprise clients say reports take too long\n- Price: $25/user/mo vs Tableau $70/user/mo\n- Beta: 12 clients, avg 40% reduction in reporting time\n\nBusiness case:\n- Q1 target: 50 enterprise clients\n- Revenue projection: $3M ARR by Q4\n- Required investment: $800K',
    'A great pitch has: 1) Hook (why this matters now), 2) The problem, 3) Your solution, 4) Evidence/data, 5) Ask (what you need). Prepare for tough questions about ROI and timeline!',
    '{"goal_achieved": true, "min_vocabulary_terms": 5, "agent_satisfaction_score": 4, "presentation_quality_min": 5}'::jsonb,
    '[]'::jsonb,
    true, '{"I-01"}',
    'We''re ready to hear your pitch. You have 5 minutes. Make it count.',
    'mark', 'presentation'
  ),
  (
    'A-02', 'Budget Cut Crisis', 'advanced',
    array['mark', 'sarah', 'priya', 'tom'],
    'A 30% budget cut has just been announced. Reprioritize the product roadmap, communicate the changes to all stakeholders, and manage the fallout professionally.',
    E'BUDGET CUT ANNOUNCEMENT\n\nQ4 budgets reduced by 30%, effective immediately.\n\nCurrent roadmap (at risk):\n1. SmartInsights AI feature — $300K\n2. Mobile app redesign — $150K (Priya: 60% done)\n3. Enterprise SSO upgrade — $200K (Tom: in his contract)\n4. Performance optimization — $50K (Sarah: says critical)\n5. New onboarding flow — $80K (low priority)\n\nTotal budget now available: $540K (was $780K)\nYou must cut $240K.',
    'Think strategically: which cuts have the least business impact? Communicate each decision with a reason. Acknowledge the difficulty. Offer alternatives where possible.',
    '{"goal_achieved": true, "min_vocabulary_terms": 6, "agent_satisfaction_score": 3}'::jsonb,
    '[]'::jsonb,
    true, '{"I-02"}',
    'I just got off the phone with the CFO. 30% budget cut, effective immediately. I need you to come back to me with a revised roadmap by end of day. What''s your plan?',
    'mark', 'chat'
  )
on conflict (id) do nothing;

-- Seed glossary
insert into public.glossary (term, definition_he, category) values
  ('Agent', 'תוכנת AI שממלאת תפקיד של אדם', 'core'),
  ('Product Manager', 'מי שאחראי על תכנון ופיתוח מוצר', 'roles'),
  ('PM', 'מנהל מוצר — אחראי על תכנון ופיתוח', 'roles'),
  ('Scenario', 'מצב עסקי מדומה', 'core'),
  ('Stakeholder', 'בעל עניין במוצר', 'business'),
  ('Pitch', 'הצגה קצרה ומשכנעת של רעיון', 'communication'),
  ('Feature', 'יכולת ספציפית שהמוצר מציע', 'product'),
  ('Sprint', 'תקופת עבודה קצרה (כ-2 שבועות)', 'agile'),
  ('Feedback', 'תגובה והערות לשם שיפור', 'communication'),
  ('Roadmap', 'תוכנית פיתוח לאורך זמן', 'product'),
  ('PRD', 'מסמך דרישות מוצר (Product Requirements Doc)', 'product'),
  ('KPI', 'מדד ביצועי מפתח', 'business'),
  ('Async', 'עבודה שלא בו-זמנית', 'work'),
  ('Scope creep', 'הרחבת פרויקט מעבר למוסכם', 'agile'),
  ('Standup', 'פגישת סטטוס יומית קצרה', 'agile'),
  ('Blocker', 'מכשול שמונע התקדמות', 'agile'),
  ('Deliverable', 'פריט שיש לספק בסיום עבודה', 'business'),
  ('Milestone', 'אבן דרך חשובה בפרויקט', 'business'),
  ('ROI', 'החזר על השקעה (Return on Investment)', 'business'),
  ('SLA', 'הסכם רמת שירות (Service Level Agreement)', 'business'),
  ('Escalate', 'להעביר לגורם בכיר יותר לטיפול', 'communication'),
  ('Alignment', 'הסכמה ותיאום בין כל הצדדים', 'communication')
on conflict (term) do nothing;
