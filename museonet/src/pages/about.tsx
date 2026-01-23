import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="page">
      <Head>
        <title>Біз туралы — museonet</title>
        <meta
          name="description"
          content="museonet жобасының миссиясы мен тарихы туралы қысқаша ақпарат."
        />
      </Head>

      <Header />

      <main>
        <section className="section about-hero">
          <div className="container">
            <span className="eyebrow">Жоба туралы</span>
            <h1>museonet туралы</h1>
            <p className="lead">
              museonet — археологияны қоғамға жақындататын, ғылыми дерекке негізделген виртуалды музей.
              Біз зерттеу нәтижелерін көрнекі әрі түсінікті форматқа айналдырамыз және платформаны үш
              тілде ұсынамыз: қазақша, орысша және ағылшынша.
            </p>
          </div>
        </section>

        <section className="section section--tight">
          <div className="container">
            <div className="info-grid">
              {[
                {
                  title: 'Mission',
                  text: 'Археологиялық мұраны сақтау және жаңа буынға жеткізу.',
                },
                {
                  title: 'Team',
                  text: 'Ғалымдар, дизайнерлер және кураторлардан құралған шағын топ.',
                },
                {
                  title: 'Our Story',
                  text: 'Жоба зертхана жұмыстарынан басталып, ұлттық музейлермен серіктестікке ұласты.',
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
