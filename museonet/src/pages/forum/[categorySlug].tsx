import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/forum/Breadcrumbs';
import ThreadList from '../../components/forum/ThreadList';
import type { ForumCategory, ForumThread } from '../../types/forum';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categorySlug } = router.query;
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!categorySlug) return;
    const load = async () => {
      const [threadsRes, categoriesRes] = await Promise.all([
        fetch(`/api/forum/category/${categorySlug}/threads`),
        fetch('/api/forum/categories'),
      ]);
      const threadsData = threadsRes.ok ? await threadsRes.json() : [];
      const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];
      setThreads(threadsData);
      setCategory(categoriesData.find((item: ForumCategory) => item.slug === categorySlug) ?? null);
      if (typeof window !== 'undefined') {
        setUserEmail(window.localStorage.getItem('museonetUserEmail') ?? '');
      }
    };
    load();
  }, [categorySlug]);

  const handleCreate = async () => {
    if (!category) return;
    const userName = window.localStorage.getItem('museonetUserName') ?? 'Museonet';
    const response = await fetch('/api/forum/thread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: category.id,
        title,
        authorName: userName,
        authorEmail: userEmail,
        content,
        tags: [],
      }),
    });
    if (response.ok) {
      const thread = await response.json();
      router.push(`/forum/thread/${thread.id}`);
    }
  };

  return (
    <div className="page">
      <Head>
        <title>{category?.title ?? 'Forum'} — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section">
          <div className="container">
            <Breadcrumbs
              items={[
                { label: 'Forum', href: '/forum' },
                { label: category?.title ?? String(categorySlug ?? '') },
              ]}
            />
            <div className="category-header">
              <div>
                <h1>{category?.title}</h1>
                <p>{category?.description}</p>
              </div>
            </div>
            <div className="category-layout">
              <div>
                <ThreadList threads={threads} />
              </div>
              <aside className="new-thread">
                <h3>New thread</h3>
                {!userEmail ? (
                  <p>Thread жасау үшін аккаунтқа кіріңіз.</p>
                ) : (
                  <>
                    <input
                      className="input"
                      placeholder="Тақырып"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <textarea
                      className="input"
                      rows={6}
                      placeholder="Мәтін..."
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                    />
                    <button
                      className="button button-primary"
                      type="button"
                      disabled={!title.trim() || content.trim().length < 10}
                      onClick={handleCreate}
                    >
                      Publish
                    </button>
                  </>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 16px 0 24px;
        }

        .category-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 20px;
        }

        .new-thread {
          padding: 16px;
          border-radius: 16px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
          display: grid;
          gap: 12px;
          height: fit-content;
        }

        @media (max-width: 900px) {
          .category-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
