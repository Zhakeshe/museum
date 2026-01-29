import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsCards from '../components/profile/StatsCards';
import AchievementsGrid from '../components/profile/AchievementsGrid';
import RecentSessions from '../components/profile/RecentSessions';
import WeeklyActivity from '../components/profile/WeeklyActivity';
import QuickSettings from '../components/profile/QuickSettings';
import { loadGuestProgress } from '../lib/gameProgress';
import { createDefaultProfile, defaultAchievements, scoreLevelThresholds } from '../lib/profileSeeds';
import { loadProfileStorage, mergeProfiles, saveProfileStorage } from '../lib/profileStorage';
import type { ProfileAchievement, ProfilePayload } from '../types/profile';

const computeLevel = (score: number) => {
  let level = 1;
  for (let i = 0; i < scoreLevelThresholds.length; i += 1) {
    if (score >= scoreLevelThresholds[i]) level = i + 1;
  }
  const currentThreshold = scoreLevelThresholds[level - 1] ?? 0;
  const nextThreshold = scoreLevelThresholds[level] ?? currentThreshold + 400;
  const progress = Math.min(100, Math.round(((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
  return { level, progress };
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfilePayload>(createDefaultProfile());
  const [achievements, setAchievements] = useState<ProfileAchievement[]>(defaultAchievements);

  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await loadProfileStorage();
      const gameProgress = await loadGuestProgress();
      const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('museonetUserEmail') : '';
      const userName = typeof window !== 'undefined' ? window.localStorage.getItem('museonetUserName') ?? '' : '';
      const levelInfo = computeLevel(gameProgress.totalScore);
      const enriched = {
        ...storedProfile,
        name: storedProfile.name || userName,
        email: storedProfile.email || userEmail,
        totalScore: gameProgress.totalScore,
        level: levelInfo.level,
        levelProgress: levelInfo.progress,
        perGame: {
          puzzle: {
            ...storedProfile.perGame.puzzle,
            level: gameProgress.perGame.puzzle.level,
          },
          quiz: {
            ...storedProfile.perGame.quiz,
            level: gameProgress.perGame.quiz.level,
          },
          matching: {
            ...storedProfile.perGame.matching,
            level: gameProgress.perGame.matching.level,
          },
        },
        lastSavedAt: new Date().toLocaleTimeString(),
        lastActiveAt: gameProgress.lastActivityAt,
      };
      if (!userEmail) {
        setProfile(enriched);
        await saveProfileStorage(enriched);
        return;
      }
      const response = await fetch(`/api/profile?userEmail=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(userName)}`);
      const data = response.ok ? await response.json() : null;
      const merged = data?.profile ? mergeProfiles(enriched, data.profile) : enriched;
      setProfile({ ...merged, lastSavedAt: new Date().toLocaleTimeString() });
      setAchievements(data?.achievements ?? []);
      await saveProfileStorage(merged);
      await fetch('/api/profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, profile: merged }),
      });
    };

    loadProfile();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const safeName = profile.name?.trim() ? profile.name : '';
    const base = safeName ? `Қайырлы ${hour < 12 ? 'таң' : hour < 18 ? 'күн' : 'кеш'}, ${safeName}!` : 'Қайырлы таң!';
    return base;
  }, [profile.name]);

  const handleExport = async () => {
    if (profile.email) {
      const response = await fetch('/api/profile/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: profile.email }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'museonet-profile.json';
        link.click();
        window.URL.revokeObjectURL(url);
        return;
      }
    }
    const link = document.createElement('a');
    link.href = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(profile, null, 2))}`;
    link.download = 'museonet-profile.json';
    link.click();
  };

  const handleSettings = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleSettingsChange = async (updated: ProfilePayload) => {
    const next = { ...updated, lastSavedAt: new Date().toLocaleTimeString(), updatedAt: new Date().toISOString() };
    setProfile(next);
    await saveProfileStorage(next);
    if (updated.email) {
      await fetch('/api/profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: updated.email, profile: next }),
      });
    }
  };

  return (
    <div className="page">
      <Head>
        <title>Profile — museonet</title>
      </Head>

      <Header />

      <main>
        <section className="section profile-section">
          <motion.div
            className="profile-background"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="container">
            <ProfileHeader profile={profile} greeting={greeting} onExport={handleExport} onSettings={handleSettings} />

            <div className="profile-grid">
              <div className="profile-main">
                <section className="profile-block">
                  <h2>Game activity (7 күн)</h2>
                  <WeeklyActivity data={profile.weeklyActivity} />
                </section>

                <section className="profile-block">
                  <h2>Recent sessions</h2>
                  <RecentSessions sessions={profile.sessions.slice(0, 10)} />
                </section>

                <section className="profile-block">
                  <h2>Personal records</h2>
                  <StatsCards profile={profile} />
                </section>
              </div>

              <aside className="profile-side">
                <section className="profile-block">
                  <h2>Achievements</h2>
                  <AchievementsGrid achievements={achievements} profile={profile} />
                </section>

                <section className="profile-block">
                  <h2>Challenges</h2>
                  <div className="challenge-list">
                    {profile.missions.map((mission) => (
                      <div key={mission.id} className="challenge-card">
                        <strong>{mission.title}</strong>
                        <p>{mission.description}</p>
                        <div className="challenge-bar">
                          <span style={{ width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` }} />
                        </div>
                        <span>
                          {mission.progress}/{mission.target}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="profile-block">
                  <QuickSettings profile={profile} onChange={handleSettingsChange} />
                </section>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .profile-section {
          position: relative;
          overflow: hidden;
        }

        .profile-background {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(138, 106, 69, 0.25), transparent 70%);
          top: -120px;
          right: -120px;
          z-index: 0;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: 24px;
          margin-top: 32px;
          position: relative;
          z-index: 1;
        }

        .profile-main,
        .profile-side {
          display: grid;
          gap: 20px;
        }

        .profile-block {
          padding: 20px;
          border-radius: 18px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.75);
          box-shadow: var(--shadow-soft);
          display: grid;
          gap: 16px;
        }

        .challenge-list {
          display: grid;
          gap: 12px;
        }

        .challenge-card {
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(138, 106, 69, 0.18);
          background: rgba(255, 255, 255, 0.7);
          display: grid;
          gap: 8px;
        }

        .challenge-card p {
          font-size: 13px;
          color: rgba(43, 43, 43, 0.6);
        }

        .challenge-bar {
          height: 6px;
          border-radius: 999px;
          background: rgba(138, 106, 69, 0.12);
          overflow: hidden;
        }

        .challenge-bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #8a6a45, #c2a679);
        }

        @media (max-width: 900px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
