# Museum Game MVP System

## 1) Folder structure plan
```
src/
  components/
    games/
      GameCard.tsx
      PuzzleBoard.tsx
      QuizRunner.tsx
      MatchingBoard.tsx
  lib/
    adminAuth.ts
    gameProgress.ts
    gameScoring.ts
    gameSeeds.ts
  pages/
    games/
      index.tsx
      puzzle.tsx
      quiz.tsx
      matching.tsx
    admin/
      games/
        index.tsx
    api/
      games/
        config.ts
        content.ts
        progress.ts
        submit.ts
      admin/
        games/
          analytics.ts
          content.ts
          levels.ts
          progress.ts
          scoring.ts
          theme.ts
  types/
    gameSystem.ts
```

## 2) Data model (PostgreSQL)
```sql
-- User table exists already.
CREATE TABLE game_progress (
  user_email TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE game_content (
  id SERIAL PRIMARY KEY,
  game_type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE game_level_configs (
  id SERIAL PRIMARY KEY,
  game_type TEXT NOT NULL,
  level INTEGER NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE (game_type, level)
);

CREATE TABLE scoring_rules (
  id INTEGER PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE theme_settings (
  id INTEGER PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL
);
```

### Entity checklist
- **User** (existing)
- **GameProgress** → `game_progress`
- **PuzzleImage/QuizQuestion/MatchingPair** → `game_content` (typed via `game_type` + `payload`)
- **GameLevelConfig** → `game_level_configs`
- **ScoringRules** → `scoring_rules`
- **ThemeSettings** → `theme_settings`
- **AnalyticsEvent** → `analytics_events`

## 3) API map
### Public gameplay
- `GET /api/games/content?type=puzzle|quiz|matching`
- `GET /api/games/config`
- `GET /api/games/progress?userEmail=...`
- `POST /api/games/progress` (sync progress)
- `POST /api/games/submit` (submit gameplay result)

### Admin (RBAC protected via header role)
- `GET/POST/PUT /api/admin/games/content`
- `GET/PUT /api/admin/games/scoring`
- `GET/PUT /api/admin/games/levels`
- `GET/PUT /api/admin/games/theme`
- `GET /api/admin/games/analytics`
- `GET/POST /api/admin/games/progress`

## 4) Core game components
- **PuzzleBoard**: grid swap puzzle, preview phase + timer
- **QuizRunner**: image question flow with explanation and end summary
- **MatchingBoard**: image-to-name matching with instant feedback

## 5) Progress + scoring engine
- **Progress persistence**: LocalStorage + IndexedDB for guests, server sync for logged-in users.
- **Conflict strategy**: latest `updatedAt` wins; merge levels + unlocked arrays.
- **Scoring engine**: unified calculation per game with bonus + penalty support.

## 6) Admin UI list
- Game system dashboard (content, scoring, levels, theme, analytics, user tools)

## 7) Performance & caching notes
- Store media as CDN URLs in `game_content.payload.image`.
- Cache `/api/games/content` responses in browser, prefetch when entering dashboard.
- Use lightweight previews for puzzle images (thumb + full).
```
