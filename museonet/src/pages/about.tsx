import React, { useMemo } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(
    () => ({
      kk: {
        title: 'Біз туралы — museonet',
        eyebrow: 'Жоба туралы',
        heading: 'museonet туралы',
        lead:
          'museonet — археологияны қоғамға жақындататын, ғылыми дерекке негізделген виртуалды музей. Біз зерттеу нәтижелерін көрнекі әрі түсінікті форматқа айналдырамыз және платформаны үш тілде ұсынамыз: қазақша, орысша және ағылшынша.',
      },
      ru: {
        title: 'О проекте — museonet',
        eyebrow: 'О проекте',
        heading: 'О museonet',
        lead:
          'museonet — виртуальный музей, приближающий археологию к обществу и основанный на научных данных. Мы делаем исследования наглядными и доступными на казахском, русском и английском языках.',
      },
      en: {
        title: 'About — museonet',
        eyebrow: 'About the project',
        heading: 'About museonet',
        lead:
          'museonet is a virtual museum built on scientific data to bring archaeology closer to everyone. We publish research in Kazakh, Russian, and English with clear, visual storytelling.',
      },
    }),
    [],
  );

  return (
    <div className="page">
      <Head>
        <title>{copy[language].title}</title>
        <meta name="description" content={copy[language].lead} />
      </Head>

      <Header />

      <main>
        <section className="section about-hero">
          <div className="container">
            <span className="eyebrow">{copy[language].eyebrow}</span>
            <h1>{copy[language].heading}</h1>
            <p className="lead">{copy[language].lead}</p>
          </div>
        </section>

        <section className="section section--tight">
          <div className="container">
            <div className="info-grid">
              {[
                {
                  title: language === 'kk' ? 'Mission' : language === 'ru' ? 'Миссия' : 'Mission',
                  text:
                    language === 'kk'
                      ? 'Археологиялық мұраны сақтау және жаңа буынға жеткізу.'
                      : language === 'ru'
                        ? 'Сохранение археологического наследия и его передача новым поколениям.'
                        : 'Preserving archaeology heritage for future generations.',
                },
                {
                  title: language === 'kk' ? 'Team' : language === 'ru' ? 'Команда' : 'Team',
                  text:
                    language === 'kk'
                      ? 'Ғалымдар, дизайнерлер және кураторлардан құралған шағын топ.'
                      : language === 'ru'
                        ? 'Небольшая команда ученых, дизайнеров и кураторов.'
                        : 'A small team of researchers, designers, and curators.',
                },
                {
                  title:
                    language === 'kk' ? 'Our Story' : language === 'ru' ? 'История' : 'Our Story',
                  text:
                    language === 'kk'
                      ? 'Жоба зертхана жұмыстарынан басталып, ұлттық музейлермен серіктестікке ұласты.'
                      : language === 'ru'
                        ? 'Проект начался с лабораторных исследований и вырос в партнерскую сеть.'
                        : 'The project began in labs and grew into a national partnership.',
                },
              ].map((item) => (
                <div className="card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .about-hero {
          background: linear-gradient(90deg, rgba(217, 195, 162, 0.18), rgba(246, 241, 232, 0.6));
        }

        .about-hero h1 {
          font-size: clamp(36px, 3vw, 48px);
          margin: 12px 0 16px;
        }

        .lead {
          max-width: 640px;
          font-size: 18px;
          color: rgba(43, 43, 43, 0.72);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .card h3 {
          font-size: 18px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .card p {
          color: rgba(43, 43, 43, 0.7);
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
