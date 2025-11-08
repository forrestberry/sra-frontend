export const APP_NAME = 'SRA Web App';
export const APP_DESCRIPTION =
  'Supabase-powered practice workspace for students and a visibility dashboard for parents shepherding the SRA Specific Skills journey.';

export type SupportedRole = 'parent' | 'student';

export const ROLE_PATHS: Record<SupportedRole, `/${SupportedRole}`> = {
  parent: '/parent',
  student: '/student',
};

const marketingCopy = {
  hero: {
    kicker: 'Independent practice, guided by insights',
    headline: 'Keep every SRA reader on pace with confidence',
    subhead:
      'Parents set up accounts, students work through books, and everyone stays aligned thanks to real-time progress tracking and checkpoint feedback.',
  },
  highlights: [
    {
      title: 'Curriculum-aware',
      description:
        'SRA Levels, Categories, Books, Units, Questions, and Answers map 1:1 with the Supabase schema, so the UI never drifts from the source of truth.',
    },
    {
      title: 'Role-aware',
      description:
        'Parents handle invites and book curation while students stay focused on the next unit. Auth metadata keeps permissions simple.',
    },
    {
      title: 'Checkpoints built-in',
      description:
        'Every 5 units (configurable) the student reviews missed questions until they stick, mirroring the classroom workflow.',
    },
  ],
};

export const MARKETING_CONTENT = marketingCopy;
export const MARKETING_HIGHLIGHTS = marketingCopy.highlights;

export function getRolePath(role?: string | null) {
  if (role && role in ROLE_PATHS) {
    return ROLE_PATHS[role as SupportedRole];
  }

  return '/';
}
