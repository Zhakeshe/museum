import React, { useMemo, useState } from 'react';

export type QuizQuestion = {
  id: number;
  image: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

type QuizRunnerProps = {
  questions: QuizQuestion[];
  onComplete: (summary: { correct: number; mistakes: number; streak: number }) => void;
};

const QuizRunner: React.FC<QuizRunnerProps> = ({ questions, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const current = questions[index];
  const isLast = index === questions.length - 1;

  const status = useMemo(() => {
    if (selected === null) return null;
    return selected === current.correctIndex ? 'correct' : 'wrong';
  }, [selected, current.correctIndex]);

  const handleAnswer = (choice: number) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === current.correctIndex) {
      setCorrect((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setMistakes((prev) => prev + 1);
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (selected === null) return;
    if (isLast) {
      onComplete({ correct, mistakes, streak });
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(null);
  };

  return (
    <div className="quiz-runner">
      <div className="quiz-image" style={{ backgroundImage: `url(${current.image})` }} />
      <h3>{current.question}</h3>
      <div className="quiz-options">
        {current.options.map((option, optionIndex) => (
          <button
            key={option}
            type="button"
            className={`quiz-option ${
              selected === optionIndex ? (optionIndex === current.correctIndex ? 'is-correct' : 'is-wrong') : ''
            }`}
            onClick={() => handleAnswer(optionIndex)}
          >
            {option}
          </button>
        ))}
      </div>
      {status && (
        <div className={`quiz-feedback ${status === 'correct' ? 'is-correct' : 'is-wrong'}`}>
          {status === 'correct' ? 'Дұрыс жауап!' : 'Қате жауап.'}
          {current.explanation && <p>{current.explanation}</p>}
        </div>
      )}
      <button className="button button-primary" type="button" onClick={handleNext}>
        {isLast ? 'Қорытынды' : 'Келесі сұрақ'}
      </button>
      <style jsx>{`
        .quiz-runner {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .quiz-image {
          height: 220px;
          border-radius: var(--radius-md);
          background-size: cover;
          background-position: center;
          box-shadow: var(--shadow-soft);
        }

        .quiz-options {
          display: grid;
          gap: 12px;
        }

        .quiz-option {
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid rgba(138, 106, 69, 0.2);
          background: rgba(255, 255, 255, 0.7);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quiz-option.is-correct {
          border-color: rgba(39, 174, 96, 0.4);
          background: rgba(39, 174, 96, 0.12);
        }

        .quiz-option.is-wrong {
          border-color: rgba(231, 76, 60, 0.4);
          background: rgba(231, 76, 60, 0.12);
        }

        .quiz-feedback {
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(138, 106, 69, 0.12);
        }

        .quiz-feedback.is-correct {
          background: rgba(39, 174, 96, 0.12);
        }

        .quiz-feedback.is-wrong {
          background: rgba(231, 76, 60, 0.12);
        }

        .quiz-feedback p {
          margin-top: 6px;
          font-size: 14px;
          color: rgba(43, 43, 43, 0.7);
        }
      `}</style>
    </div>
  );
};

export default QuizRunner;
