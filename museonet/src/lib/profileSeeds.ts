import type { ProfileAchievement, ProfilePayload } from '../types/profile';

const now = () => new Date().toISOString();

export const defaultAchievements: ProfileAchievement[] = [
  {
    id: 1,
    key: 'archaeologist',
    title: 'Археолог',
    description: '10 миссияны орындаңыз',
    icon: '🏺',
    target: 10,
  },
  {
    id: 2,
    key: 'puzzle-master',
    title: 'Пазл шебері',
    description: '20 пазл жеңісіне жетіңіз',
    icon: '🧩',
    target: 20,
  },
  {
    id: 3,
    key: 'lab-analyst',
    title: 'Зертхана аналитигі',
    description: 'Викторинада 15 streak жасаңыз',
    icon: '🔎',
    target: 15,
  },
];

export const createDefaultProfile = (name = '', email = ''): ProfilePayload => ({
  name,
  email,
  totalScore: 0,
  level: 1,
  levelProgress: 0,
  lastSavedAt: now(),
  lastActiveAt: now(),
  settings: {
    sound: true,
    animationIntensity: 'medium',
    language: 'kk',
  },
  perGame: {
    puzzle: { level: 1, wins: 0, attempts: 0, bestTimeSeconds: null },
    quiz: { level: 1, wins: 0, attempts: 0, bestStreak: null },
    matching: { level: 1, wins: 0, attempts: 0, bestAccuracy: null },
  },
  achievements: defaultAchievements.map((achievement) => ({
    key: achievement.key,
    current: 0,
    unlocked: false,
  })),
  sessions: [],
  weeklyActivity: [],
  missions: [
    {
      id: 'daily-puzzle',
      title: 'Күнделікті пазл',
      description: '1 пазл сессиясын аяқтаңыз',
      progress: 0,
      target: 1,
    },
    {
      id: 'weekly-quiz',
      title: 'Апталық викторина',
      description: '5 дұрыс жауап жинаңыз',
      progress: 0,
      target: 5,
    },
  ],
  updatedAt: now(),
});

export const scoreLevelThresholds = [0, 200, 450, 800, 1300, 1900, 2600, 3400];
