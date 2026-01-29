export type ProfileAchievement = {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  target: number;
};

export type AchievementProgress = {
  key: string;
  current: number;
  unlocked: boolean;
};

export type ProfileSession = {
  id: string;
  gameType: 'puzzle' | 'quiz' | 'matching';
  scoreDelta: number;
  durationSeconds: number;
  result: 'win' | 'lose';
  playedAt: string;
};

export type WeeklyActivityPoint = {
  date: string;
  plays: number;
  points: number;
};

export type ProfilePayload = {
  name: string;
  email: string;
  totalScore: number;
  level: number;
  levelProgress: number;
  lastSavedAt: string;
  lastActiveAt: string;
  settings: {
    sound: boolean;
    animationIntensity: 'low' | 'medium' | 'high';
    language: 'kk' | 'ru' | 'en';
  };
  perGame: {
    puzzle: { level: number; wins: number; attempts: number; bestTimeSeconds: number | null };
    quiz: { level: number; wins: number; attempts: number; bestStreak: number | null };
    matching: { level: number; wins: number; attempts: number; bestAccuracy: number | null };
  };
  achievements: AchievementProgress[];
  sessions: ProfileSession[];
  weeklyActivity: WeeklyActivityPoint[];
  missions: { id: string; title: string; description: string; progress: number; target: number }[];
  updatedAt: string;
};
