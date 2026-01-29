import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryList from '../../components/forum/CategoryList';
import type { ForumCategory } from '../../types/forum';

const ForumHome: React.FC = () => {
  const [categories, setCategories] = useState<(ForumCategory & { threadCount: number; postCount: number })[]>([]);
  const [search, setSearch] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/forum/categories');
      const data = response.ok ? await response.json() : [];
      setCategories(data);
      if (typeof window !== 'undefined') {
        setUserEmail(window.localStorage.getItem('museonetUserEmail') ?? '');
      }
    };
    load();
  }, []);

  const filtered = categories.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase()) ||
    category.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page">
      <Head>
        <title>Forum — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section forum-hero">
          <motion.div
            className="forum-glow"
            animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="container forum-header">
            <div>
              <span className="eyebrow">Museum Forum</span>
              <h1>Музей қауымдастығы</h1>
              <p>Жәдігерлер, музейлер және ойындар туралы пікір бөлісіңіз.</p>
            </div>
            <div className="forum-actions">
              <input
                className="input"
                placeholder="Іздеу..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="button button-primary" type="button" disabled={!userEmail}>
                {userEmail ? 'Create thread' : 'Login to post'}
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <CategoryList categories={filtered} />
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .forum-hero {
          position: relative;
          overflow: hidden;
        }

        .forum-glow {
          position: absolute;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(138, 106, 69, 0.3), transparent 70%);
          top: -120px;
          left: -120px;
        }

        .forum-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
        }

        .forum-actions {
          display: grid;
          gap: 12px;
          min-width: 260px;
        }

        @media (max-width: 900px) {
          .forum-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .forum-actions {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ForumHome;
