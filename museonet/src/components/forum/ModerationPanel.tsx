import React from 'react';
import type { ForumReport } from '../../types/forum';

const ModerationPanel: React.FC<{ reports: ForumReport[] }> = ({ reports }) => {
  return (
    <div className="moderation-panel">
      <h3>Reports queue</h3>
      {reports.length === 0 && <div className="empty">No reports.</div>}
      {reports.map((report) => (
        <div key={report.id} className="report-card">
          <strong>Post #{report.postId}</strong>
          <p>{report.reason}</p>
          <span>{report.reporterEmail}</span>
        </div>
      ))}
      <style jsx>{`
        .moderation-panel {
          display: grid;
          gap: 12px;
        }

        .report-card {
          padding: 12px;
          border-radius: 12px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
        }

        .report-card p {
          font-size: 13px;
          color: rgba(43, 43, 43, 0.6);
        }

        .empty {
          padding: 12px;
          border-radius: 12px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.7);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ModerationPanel;
