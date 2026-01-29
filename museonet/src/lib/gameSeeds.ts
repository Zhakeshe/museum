import type { GameContentRecord, GameLevelConfig, ScoringRules, ThemeSettings } from '../types/gameSystem';

const now = () => new Date().toISOString();

export const defaultScoringRules: ScoringRules = {
  puzzle: {
    basePoints: 120,
    timeBonusPerSecond: 2,
    levelMultiplier: 1.2,
    hintPenalty: 15,
  },
  quiz: {
    correctPoints: 50,
    wrongPenalty: 12,
    streakMultiplier: 1.15,
  },
  matching: {
    correctMatchPoints: 30,
    wrongMatchPenalty: 8,
    timeBonus: 40,
  },
  updatedAt: now(),
};

export const defaultThemeSettings: ThemeSettings = {
  gradient: 'linear-gradient(135deg, #f6f1e8 0%, #efe4d3 40%, #f9f6ef 100%)',
  overlayPattern: 'radial-gradient(circle at 20% 20%, rgba(138, 106, 69, 0.08), transparent 45%)',
  animationIntensity: 'medium',
  soundEnabled: true,
  winAnimation: 'sparkle',
  updatedAt: now(),
};

export const defaultGameLevels: GameLevelConfig[] = [
  {
    gameType: 'puzzle',
    level: 1,
    config: {
      gridSize: 3,
      timerSeconds: 120,
      bonusTimeOnWin: 8,
      snapTolerance: 12,
      scatterStrength: 0.45,
      hintsAllowed: true,
    },
    updatedAt: now(),
  },
  {
    gameType: 'quiz',
    level: 1,
    config: {
      questionsPerRun: 8,
      timePerQuestionSeconds: 18,
      streakMultiplier: 1.15,
    },
    updatedAt: now(),
  },
  {
    gameType: 'matching',
    level: 1,
    config: {
      numberOfPairs: 6,
      timerSeconds: 90,
      hintsAllowed: 2,
    },
    updatedAt: now(),
  },
];

export const defaultGameContent: GameContentRecord[] = [
  {
    id: 1,
    gameType: 'puzzle',
    title: 'Қола дәуірі жартас суреттері',
    status: 'published',
    tags: ['era:bronze', 'material:stone', 'location:almaty'],
    data: {
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      previewDurationSeconds: 3,
      difficultyTag: 'easy',
      collection: 'Тамғалы',
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 2,
    gameType: 'quiz',
    title: 'Алтын адам',
    status: 'published',
    tags: ['era:iron', 'location:esen'],
    data: {
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      question: 'Алтын адамның табылған жері қайсы?',
      options: ['Есік қорғаны', 'Түркістан', 'Тараз', 'Сауран'],
      correctIndex: 0,
      explanation: 'Алтын адам 1969 жылы Есік қорғанында табылды.',
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 3,
    gameType: 'quiz',
    title: 'Сақтар өнері',
    status: 'published',
    tags: ['era:iron', 'material:gold'],
    data: {
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      question: 'Сақтар стилінде жиі кездесетін бейне қандай?',
      options: ['Жыртқыш жануар', 'Кеме', 'Қамал', 'Гүл'],
      correctIndex: 0,
      explanation: 'Жыртқыш аң стилі сақтар мәдениетінде ерекше орын алған.',
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 4,
    gameType: 'matching',
    title: 'Қыш құмыра',
    status: 'published',
    tags: ['material:clay', 'era:medieval'],
    data: {
      image: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80',
      name: 'Қыш құмыра',
      description: 'Орта ғасырдағы тұрмыстық ыдыс.',
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 5,
    gameType: 'matching',
    title: 'Қола айна',
    status: 'published',
    tags: ['material:bronze', 'era:ancient'],
    data: {
      image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1200&q=80',
      name: 'Қола айна',
      description: 'Көшпелі мәдениеттегі сәндік айна.',
    },
    createdAt: now(),
    updatedAt: now(),
  },
];
