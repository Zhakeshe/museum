import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/forum/Breadcrumbs';
import PostList from '../../../components/forum/PostList';
import PostEditor from '../../../components/forum/PostEditor';
import type { ForumPost, ForumThread } from '../../../types/forum';

const ThreadPage: React.FC = () => {
  const router = useRouter();
  const { threadId } = router.query;
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!threadId) return;
    const load = async () => {
      const response = await fetch(`/api/forum/thread/${threadId}`);
      const data = response.ok ? await response.json() : null;
      setThread(data?.thread ?? null);
      setPosts(data?.posts ?? []);
      if (typeof window !== 'undefined') {
        setUserEmail(window.localStorage.getItem('museonetUserEmail') ?? '');
      }
    };
    load();
  }, [threadId]);

  const handleReply = async (content: string) => {
    if (!thread) return;
    const userName = window.localStorage.getItem('museonetUserName') ?? 'Museonet';
    const response = await fetch(`/api/forum/thread/${thread.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName: userName, authorEmail: userEmail, content }),
    });
    if (response.ok) {
      const post = await response.json();
      setPosts((prev) => [...prev, post]);
    }
  };

  return (
    <div className="page">
      <Head>
        <title>{thread?.title ?? 'Thread'} — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section">
          <div className="container">
            <Breadcrumbs
              items={[
                { label: 'Forum', href: '/forum' },
                { label: thread?.title ?? '' },
              ]}
            />
            <div className="thread-header">
              <h1>{thread?.title ?? 'Thread'}</h1>
              <span>{thread?.locked ? 'Locked' : 'Open'}</span>
            </div>
            <PostList posts={posts} />
            <div className="reply-block">
              {thread?.locked ? (
                <p>Thread құлыпталған.</p>
              ) : userEmail ? (
                <PostEditor onSubmit={handleReply} />
              ) : (
                <p>Жауап жазу үшін кіріңіз.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .thread-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 16px 0 24px;
        }

        .reply-block {
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
};

export default ThreadPage;
