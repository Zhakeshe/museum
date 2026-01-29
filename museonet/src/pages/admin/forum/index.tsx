import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ModerationPanel from '../../../components/forum/ModerationPanel';
import type { ForumCategory, ForumReport } from '../../../types/forum';

const ADMIN_ROLE_HEADER = { 'x-user-role': 'admin' };

const AdminForumPage: React.FC = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [reports, setReports] = useState<ForumReport[]>([]);
  const [form, setForm] = useState({ title: '', slug: '', description: '', order: 1 });

  useEffect(() => {
    const load = async () => {
      const [categoriesRes, reportsRes] = await Promise.all([
        fetch('/api/forum/categories'),
        fetch('/api/admin/forum/reports', { headers: ADMIN_ROLE_HEADER }),
      ]);
      setCategories(categoriesRes.ok ? await categoriesRes.json() : []);
      setReports(reportsRes.ok ? await reportsRes.json() : []);
    };
    load();
  }, []);

  const handleCreate = async () => {
    const response = await fetch('/api/admin/forum/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...ADMIN_ROLE_HEADER },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      const category = await response.json();
      setCategories((prev) => [...prev, category]);
      setForm({ title: '', slug: '', description: '', order: form.order + 1 });
    }
  };

  return (
    <div className="page">
      <Head>
        <title>Admin Forum — museonet</title>
      </Head>
      <Header />
      <main>
        <section className="section">
          <div className="container admin-forum">
            <div className="admin-card">
              <h2>Forum categories</h2>
              <div className="admin-form">
                <input
                  className="input"
                  placeholder="Title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
                <input
                  className="input"
                  placeholder="Slug"
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                />
                <input
                  className="input"
                  placeholder="Description"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
                <button className="button button-primary" type="button" onClick={handleCreate}>
                  Create
                </button>
              </div>
              <ul className="admin-list">
                {categories.map((category) => (
                  <li key={category.id}>
                    {category.title} · {category.slug}
                  </li>
                ))}
              </ul>
            </div>
            <div className="admin-card">
              <ModerationPanel reports={reports} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx>{`
        .admin-forum {
          display: grid;
          gap: 20px;
        }

        .admin-card {
          padding: 20px;
          border-radius: 18px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
          display: grid;
          gap: 16px;
        }

        .admin-form {
          display: grid;
          gap: 12px;
        }

        .admin-list {
          list-style: none;
          display: grid;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};

export default AdminForumPage;
