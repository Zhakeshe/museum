import React from 'react';
import Link from 'next/link';

const Breadcrumbs: React.FC<{ items: { label: string; href?: string }[] }> = ({ items }) => {
  return (
    <nav className="breadcrumbs">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 && <span className="divider">/</span>}
        </span>
      ))}
      <style jsx>{`
        .breadcrumbs {
          font-size: 13px;
          color: rgba(43, 43, 43, 0.6);
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .divider {
          margin: 0 6px;
        }
      `}</style>
    </nav>
  );
};

export default Breadcrumbs;
