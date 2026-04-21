export interface GlossaryTerm {
  term: string;
  definition_he: string;
  category: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Agent', definition_he: 'תוכנת AI שממלאת תפקיד של אדם', category: 'core' },
  { term: 'Product Manager', definition_he: 'מי שאחראי על תכנון ופיתוח מוצר', category: 'roles' },
  { term: 'PM', definition_he: 'מנהל מוצר — אחראי על תכנון ופיתוח', category: 'roles' },
  { term: 'Scenario', definition_he: 'מצב עסקי מדומה', category: 'core' },
  { term: 'Stakeholder', definition_he: 'בעל עניין במוצר', category: 'business' },
  { term: 'Pitch', definition_he: 'הצגה קצרה ומשכנעת של רעיון', category: 'communication' },
  { term: 'Feature', definition_he: 'יכולת ספציפית שהמוצר מציע', category: 'product' },
  { term: 'Sprint', definition_he: 'תקופת עבודה קצרה (כ-2 שבועות)', category: 'agile' },
  { term: 'Feedback', definition_he: 'תגובה והערות לשם שיפור', category: 'communication' },
  { term: 'Roadmap', definition_he: 'תוכנית פיתוח לאורך זמן', category: 'product' },
  { term: 'PRD', definition_he: 'מסמך דרישות מוצר (Product Requirements Doc)', category: 'product' },
  { term: 'KPI', definition_he: 'מדד ביצועי מפתח', category: 'business' },
  { term: 'Async', definition_he: 'עבודה שלא בו-זמנית', category: 'work' },
  { term: 'Scope creep', definition_he: 'הרחבת פרויקט מעבר למוסכם', category: 'agile' },
  { term: 'Standup', definition_he: 'פגישת סטטוס יומית קצרה', category: 'agile' },
  { term: 'Blocker', definition_he: 'מכשול שמונע התקדמות', category: 'agile' },
  { term: 'Deliverable', definition_he: 'פריט שיש לספק בסיום עבודה', category: 'business' },
  { term: 'Milestone', definition_he: 'אבן דרך חשובה בפרויקט', category: 'business' },
  { term: 'OKR', definition_he: 'מטרות ותוצאות מפתח (Objectives & Key Results)', category: 'business' },
  { term: 'SLA', definition_he: 'הסכם רמת שירות (Service Level Agreement)', category: 'business' },
  { term: 'ROI', definition_he: 'החזר על השקעה (Return on Investment)', category: 'business' },
  { term: 'API', definition_he: 'ממשק תכנות יישומים (Application Programming Interface)', category: 'tech' },
  { term: 'User journey', definition_he: 'מסלול השימוש של המשתמש במוצר', category: 'ux' },
  { term: 'Usability', definition_he: 'נוחות השימוש במוצר', category: 'ux' },
  { term: 'Escalate', definition_he: 'להעביר לגורם בכיר יותר לטיפול', category: 'communication' },
  { term: 'Alignment', definition_he: 'הסכמה ותיאום בין כל הצדדים', category: 'communication' },
];
