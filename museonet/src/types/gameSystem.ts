export type GameType = 'puzzle' | 'quiz' | 'matching';

export type GameStatus = 'draft' | 'published' | 'scheduled';

export type GameProgressPerGame = {
  level: number;
  unlockedLevels: number[];
  lastScore: number;
  updatedAt: string;
};

export type GameProgressPayload = {
  totalScore: number;
  perGame: Record<GameType, GameProgressPerGame>;
  lastPlayedGame: GameType | null;
  lastActivityAt: string;
  settings: {
    sound: boolean;
    animationIntensity: 'low' | 'medium' | 'high';
  };
  updatedAt: string;
};

export type GameContentRecord = {
  id: number;
  gameType: GameType;
  status: GameStatus;
  title: string;
  tags: string[];
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type GameLevelConfig = {
  gameType: GameType;
  level: number;
  config: Record<string, unknown>;
  updatedAt: string;
};

export type ScoringRules = {
  puzzle: {
    basePoints: number;
    timeBonusPerSecond: number;
    levelMultiplier: number;
    hintPenalty: number;
  };
  quiz: {
    correctPoints: number;
    wrongPenalty: number;
    streakMultiplier: number;
  };
  matching: {
    correctMatchPoints: number;
    wrongMatchPenalty: number;
    timeBonus: number;
  };
  updatedAt: string;
};

export type ThemeSettings = {
  gradient: string;
  overlayPattern: string;
  animationIntensity: 'low' | 'medium' | 'high';
  soundEnabled: boolean;
  winAnimation: 'confetti' | 'sparkle' | 'none';
  updatedAt: string;
};

export type AnalyticsEvent = {
  id: number;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type AnalyticsSummary = {
  totalPlays: number;
  playsByGame: Record<GameType, number>;
  winRateByLevel: Record<string, number>;
  avgCompletionByGame: Record<GameType, number>;
  hardestLevels: { level: string; failRate: number }[];
  mostMissedQuiz: { id: string; misses: number }[];
  mostMistakenPairs: { id: string; misses: number }[];
  returningUsers: number;
  lastActivityAt: string | null;
};
