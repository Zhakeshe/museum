import type { ForumCategory } from '../types/forum';

const now = () => new Date().toISOString();

export const defaultForumCategories: ForumCategory[] = [
  {
    id: 1,
    title: 'General',
    slug: 'general',
    description: 'Жалпы талқылаулар мен ұсыныстар.',
    order: 1,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 2,
    title: 'Museums',
    slug: 'museums',
    description: 'Қазақстан музейлері туралы пікір алмасу.',
    order: 2,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 3,
    title: 'Artifacts',
    slug: 'artifacts',
    description: 'Жәдігерлер мен экспонаттарға қатысты сұрақтар.',
    order: 3,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 4,
    title: 'Games',
    slug: 'games',
    description: 'Ойындар, деңгейлер және рекордтар туралы.',
    order: 4,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 5,
    title: 'Help',
    slug: 'help',
    description: 'Көмек және қолдау сұрақтары.',
    order: 5,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 6,
    title: 'Announcements',
    slug: 'announcements',
    description: 'Ресми жаңалықтар мен хабарламалар.',
    order: 6,
    createdAt: now(),
    updatedAt: now(),
  },
];
