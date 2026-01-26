import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const games = [
  { title: 'Қабаттар құпиясы', level: 'Beginner', text: 'Қазба кезеңдерін таныстыру.' },
  { title: 'Артефакт іздеуі', level: 'Beginner', text: 'Жәдігерлерді сәйкестендіру ойыны.' },
  { title: 'Картадағы экспедиция', level: 'Beginner', text: 'Ежелгі мекендерді картадан табу.' },
  { title: 'Ғалым күнделігі', level: 'Advanced', text: 'Зерттеу жазбаларын жүйелеу.' },
  { title: 'Қыш сынықтары', level: 'Advanced', text: 'Қалпына келтіру логикасы.' },
  { title: 'Талдау станциясы', level: 'Advanced', text: 'Лабораториялық шешім қабылдау.' },
];

const GamesPage: React.FC = () => {
  const { language } = useLanguage();
  const pageTitle =
    language === 'kk' ? 'Ойындар — museonet' : language === 'ru' ? 'Игры — museonet' : 'Games — museonet';
  const heading =
    language === 'kk' ? 'Ойындар' : language === 'ru' ? 'Игры' : 'Games';
  const subtext =
    language === 'kk'
      ? 'Күрделілік деңгейі бойынша сүзгі таңдаңыз.'
      : language === 'ru'
        ? 'Выберите фильтр по уровню сложности.'
        : 'Choose a difficulty filter.';

  return (
    <div className="page">
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            language === 'kk'
              ? 'Археологияға арналған білім беру ойындары.'
              : language === 'ru'
                ? 'Обучающие игры по археологии.'
                : 'Educational archaeology games.'
          }
        />
      </Head>

      <Header />

      <main>
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Оқу форматы</span>
                <h2>{heading}</h2>
              </div>
              <p>{subtext}</p>
            </div>

            <div className="filters">
              <span className="chip is-active">All</span>
              <span className="chip">Beginner</span>
              <span className="chip">Advanced</span>
            </div>

            <div className="games-grid">
              {games.map((game) => (
                <div className="card" key={game.title}>
                  <div className="game-header">
                    <h3>{game.title}</h3>
                    <span className="chip">{game.level}</span>
                  </div>
                  <p>{game.text}</p>
                  <button className="button button-secondary" type="button">
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card h3 {
          font-size: 18px;
          font-weight: 600;
        }

        .card p {
          color: rgba(43, 43, 43, 0.7);
          margin-bottom: 20px;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};

export default GamesPage;
