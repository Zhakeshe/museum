import React from 'react';
import Link from 'next/link';
import type { ForumThread } from '../../types/forum';

const ThreadList: React.FC<{ threads: ForumThread[] }> = ({ threads }) => {
  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <Link key={thread.id} href={`/forum/thread/${thread.id}`} className="thread-card">
          <div>
            <h3>
              {thread.pinned && <span className="badge">Pinned</span>} {thread.title}
            </h3>
            <p>
              {thread.authorName} · {thread.repliesCount} replies
            </p>
          </div>
          <div className="thread-meta">
            {thread.locked && <span className="badge muted">Locked</span>}
            <span>{new Date(thread.lastPostAt).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
      {threads.length === 0 && <div className="empty">Бұл категорияда тақырыптар жоқ.</div>}
      <style jsx>{`
        .thread-list {
          display: grid;
          gap: 12px;
        }

        .thread-card {
          padding: 16px 20px;
          border-radius: 16px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s ease;
        }

        .thread-card:hover {
          transform: translateY(-2px);
        }

        .thread-meta {
          display: grid;
          gap: 4px;
          text-align: right;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(138, 106, 69, 0.2);
          font-size: 11px;
          margin-right: 6px;
        }

        .badge.muted {
          background: rgba(43, 43, 43, 0.1);
        }

        p {
          color: rgba(43, 43, 43, 0.6);
          font-size: 13px;
        }

        .empty {
          padding: 20px;
          border-radius: 12px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.7);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ThreadList;
