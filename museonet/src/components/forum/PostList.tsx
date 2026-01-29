import React from 'react';
import type { ForumPost } from '../../types/forum';

const PostList: React.FC<{ posts: ForumPost[] }> = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className={`post-card ${post.isDeleted ? 'is-deleted' : ''}`}>
          <div className="post-header">
            <strong>{post.authorName}</strong>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <p>{post.isDeleted ? 'Бұл хабарлама өшірілді.' : post.content}</p>
          {post.editedAt && <span className="edited">Edited</span>}
        </div>
      ))}
      <style jsx>{`
        .post-list {
          display: grid;
          gap: 16px;
        }

        .post-card {
          padding: 16px;
          border-radius: 16px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
        }

        .post-card.is-deleted {
          opacity: 0.6;
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        .edited {
          font-size: 11px;
          color: rgba(43, 43, 43, 0.45);
        }
      `}</style>
    </div>
  );
};

export default PostList;
