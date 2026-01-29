import React from 'react';
import Link from 'next/link';

type CategoryItem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  threadCount: number;
  postCount: number;
};

const CategoryList: React.FC<{ categories: CategoryItem[] }> = ({ categories }) => {
  return (
    <div className="category-list">
      {categories.map((category) => (
        <Link key={category.id} href={`/forum/${category.slug}`} className="category-card">
          <div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </div>
          <div className="category-meta">
            <span>{category.threadCount} topics</span>
            <span>{category.postCount} posts</span>
          </div>
        </Link>
      ))}
      <style jsx>{`
        .category-list {
          display: grid;
          gap: 16px;
        }

        .category-card {
          padding: 20px;
          border-radius: 18px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: space-between;
          gap: 16px;
          box-shadow: var(--shadow-soft);
          transition: transform 0.2s ease;
        }

        .category-card:hover {
          transform: translateY(-2px);
        }

        .category-meta {
          display: grid;
          text-align: right;
          font-size: 12px;
          color: rgba(43, 43, 43, 0.6);
        }

        p {
          color: rgba(43, 43, 43, 0.65);
        }
      `}</style>
    </div>
  );
};

export default CategoryList;
