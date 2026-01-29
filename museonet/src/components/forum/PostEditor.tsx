import React, { useState } from 'react';

type PostEditorProps = {
  onSubmit: (content: string) => void;
  disabled?: boolean;
};

const PostEditor: React.FC<PostEditorProps> = ({ onSubmit, disabled }) => {
  const [content, setContent] = useState('');

  return (
    <div className="post-editor">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Жауабыңызды жазыңыз..."
        rows={5}
        disabled={disabled}
      />
      <button
        className="button button-primary"
        type="button"
        disabled={disabled || content.trim().length < 3}
        onClick={() => {
          onSubmit(content);
          setContent('');
        }}
      >
        Жауап беру
      </button>
      <style jsx>{`
        .post-editor {
          display: grid;
          gap: 12px;
          padding: 16px;
          border-radius: 16px;
          border: var(--border);
          background: rgba(255, 255, 255, 0.8);
        }

        textarea {
          border-radius: 12px;
          border: 1px solid rgba(138, 106, 69, 0.2);
          padding: 12px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default PostEditor;
