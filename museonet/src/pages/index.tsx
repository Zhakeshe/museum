import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Главная - e-museum.kz</title>
        <meta
          name="description"
          content="Виртуальный музей «E-museum» — портал, где культурное наследие Казахстана оживает в цифровом пространстве"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hfeed site" id="page">
        <Header />

        <div id="content" className="site-content">
          <div className="ast-container">
            <div id="primary" className="content-area primary">
              <main id="main" className="site-main">
                <article
                  className="post-442 page type-page status-publish ast-article-single"
                  id="post-442"
                  itemType="https://schema.org/CreativeWork"
                  itemScope
                >
                  <header className="entry-header ast-no-thumbnail ast-no-title ast-header-without-markup"></header>

                  <div className="entry-content clear" itemProp="text">
                    <div
                      data-elementor-type="wp-page"
                      data-elementor-id="442"
                      className="elementor elementor-442"
                      data-elementor-post-type="page"
                    >
                      {/* Main Content Sections */}
                      <div
                        className="elementor-element elementor-element-9cd1ebf dark-section e-flex e-con-boxed e-con e-parent"
                        data-id="9cd1ebf"
                        data-element_type="container"
                      >
                        <div className="e-con-inner">
                          <section className="hero" id="museumkaz">
                            <div className="hero-text">
                              <span className="hero-pill">Digital Heritage • 2026</span>
                              <h1>Музеи Казахстана в новом 3D формате</h1>
                              <p>
                                Откройте для себя артефакты, архивы и виртуальные экспозиции, которые оживают
                                в интерактивном пространстве. Мы объединили музеи, коллекции и знания в одном
                                динамичном портале.
                              </p>
                              <div className="hero-actions">
                                <a className="primary-action" href="#models3dkaz">
                                  Смотреть 3D модели
                                </a>
                                <a className="ghost-action" href="#museumexhibitkaz">
                                  Каталог экспонатов
                                </a>
                              </div>
                              <div className="hero-stats">
                                <div>
                                  <strong>20 000+</strong>
                                  <span>экспонатов</span>
                                </div>
                                <div>
                                  <strong>120+</strong>
                                  <span>музеев</span>
                                </div>
                                <div>
                                  <strong>360°</strong>
                                  <span>панорам</span>
                                </div>
                              </div>
                            </div>
                            <div className="hero-visual">
                              <div className="orbital-card">
                                <div className="orbital-ring"></div>
                                <div className="artifact-card">
                                  <span>3D</span>
                                  <h3>Алтын адам</h3>
                                  <p>Интерактивный просмотр, сканирование и история находки.</p>
                                  <div className="artifact-glow"></div>
                                </div>
                              </div>
                              <div className="floating-info">
                                <h4>AR-гид</h4>
                                <p>Погружение в эпохи через дополненную реальность.</p>
                              </div>
                            </div>
                          </section>

                          <section className="section-nav">
                            <a href="#museumkaz">О платформе</a>
                            <a href="#models3dkaz">3D модели</a>
                            <a href="#museumexhibitkaz">Каталог</a>
                            <a href="#newskaz">Новости</a>
                          </section>

                          <section id="models3dkaz" className="feature-section">
                            <div className="section-header">
                              <h2>3D модели, которые видно и чувствуется</h2>
                              <p>
                                Улучшенная визуализация, глубина и динамика — каждый объект представлен
                                как экспозиция в вашем устройстве.
                              </p>
                            </div>
                            <div className="feature-grid">
                              <div className="feature-card">
                                <h3>Сканирование 8K</h3>
                                <p>Максимальная детализация, чтобы рассмотреть любой штрих и материал.</p>
                              </div>
                              <div className="feature-card highlight">
                                <h3>Динамическая подсветка</h3>
                                <p>Свет реагирует на курсор, создавая ощущение настоящего объема.</p>
                              </div>
                              <div className="feature-card">
                                <h3>Исторический контекст</h3>
                                <p>Таймлайны, источники и видео о происхождении каждого артефакта.</p>
                              </div>
                            </div>
                            <div className="three-d-stage">
                              <div className="three-d-frame">
                                <div className="three-d-artifact">
                                  <span className="three-d-label">Artefact 360°</span>
                                  <h3>Сарматский шлем</h3>
                                  <p>Поверните объект, чтобы рассмотреть гравировку и орнамент.</p>
                                </div>
                              </div>
                              <div className="three-d-details">
                                <div>
                                  <strong>Слои текстуры</strong>
                                  <p>3 материала, 12 карт света, интерактивный zoom.</p>
                                </div>
                                <div>
                                  <strong>Иммерсивный звук</strong>
                                  <p>Фон музея и аудиогид в одном клике.</p>
                                </div>
                              </div>
                            </div>
                          </section>

                          <section id="museumexhibitkaz" className="catalog-section">
                            <div className="section-header">
                              <h2>Государственный каталог</h2>
                              <p>Четкая навигация, новые фильтры и актуальные поступления.</p>
                            </div>
                            <div className="catalog-grid">
                              <article className="catalog-card">
                                <h3>Археология</h3>
                                <p>Монеты, керамика и редкие находки на территории Казахстана.</p>
                                <span>3 800+ объектов</span>
                              </article>
                              <article className="catalog-card">
                                <h3>Этнография</h3>
                                <p>Культура, костюмы и быт народов Центральной Азии.</p>
                                <span>2 150+ объектов</span>
                              </article>
                              <article className="catalog-card">
                                <h3>Современное искусство</h3>
                                <p>Новые художники и цифровые коллекции музеев.</p>
                                <span>980+ объектов</span>
                              </article>
                            </div>
                          </section>

                          <section id="newskaz" className="news-section">
                            <div className="section-header">
                              <h2>Новости и события</h2>
                              <p>Новые выставки, исследования и цифровые релизы.</p>
                            </div>
                            <div className="news-grid">
                              <article>
                                <h3>Виртуальная экспозиция “Шёлковый путь”</h3>
                                <p>Открыта новая выставка с 3D турами и AR-гидом.</p>
                              </article>
                              <article>
                                <h3>Цифровизация архива 1920-х</h3>
                                <p>Сканирование уникальных фотографий и рукописей.</p>
                              </article>
                              <article>
                                <h3>Ночь в музее 2026</h3>
                                <p>Онлайн-трансляции, интервью и интерактивные квесты.</p>
                              </article>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </main>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          color-scheme: light;
          --navy: #0a0f1f;
          --deep-blue: #0f1c3f;
          --accent: #4fd1ff;
          --accent-strong: #6d5cff;
          --soft: #f5f7ff;
          --text-dark: #0b1224;
          --text-muted: #51607a;
        }

        body {
          font-family: 'Nunito Sans', sans-serif;
          line-height: 1.65;
          color: var(--text-dark);
          background: radial-gradient(circle at top, #e9f2ff 0%, #f8f9ff 45%, #ffffff 100%);
        }

        .hfeed.site {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        #content.site-content {
          flex: 1;
        }

        .ast-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
          padding: 4rem 0 3rem;
          align-items: center;
        }

        .hero-text h1 {
          font-size: clamp(2.4rem, 3vw, 3.5rem);
          line-height: 1.1;
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .hero-text p {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .hero-pill {
          display: inline-flex;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          background: rgba(79, 209, 255, 0.15);
          color: var(--deep-blue);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .primary-action,
        .ghost-action {
          padding: 0.8rem 1.6rem;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .primary-action {
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%);
          color: #0b0f1d;
          box-shadow: 0 12px 30px rgba(79, 209, 255, 0.3);
        }

        .ghost-action {
          border: 1px solid rgba(13, 24, 54, 0.15);
          color: var(--deep-blue);
          background: #fff;
        }

        .primary-action:hover,
        .ghost-action:hover {
          transform: translateY(-2px);
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .hero-stats div {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .hero-stats strong {
          font-size: 1.6rem;
          color: var(--deep-blue);
        }

        .hero-stats span {
          color: var(--text-muted);
        }

        .hero-visual {
          position: relative;
          min-height: 360px;
        }

        .orbital-card {
          position: relative;
          padding: 2rem;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(13, 24, 54, 0.08), rgba(255, 255, 255, 0.6));
          overflow: hidden;
          height: 100%;
          min-height: 320px;
        }

        .orbital-ring {
          position: absolute;
          width: 280px;
          height: 280px;
          border: 1px dashed rgba(79, 209, 255, 0.7);
          border-radius: 50%;
          top: -60px;
          right: -40px;
          animation: orbit 10s linear infinite;
        }

        .artifact-card {
          position: relative;
          border-radius: 20px;
          padding: 2rem;
          background: radial-gradient(circle at top, #101b3d 0%, #0b132b 100%);
          color: #fff;
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
          box-shadow: 0 20px 40px rgba(15, 28, 63, 0.4);
        }

        .artifact-card span {
          display: inline-flex;
          padding: 0.25rem 0.7rem;
          background: rgba(79, 209, 255, 0.2);
          border-radius: 999px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .artifact-card h3 {
          font-size: 1.6rem;
          margin-bottom: 0.6rem;
        }

        .artifact-glow {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79, 209, 255, 0.6), transparent 70%);
          bottom: -40px;
          right: -20px;
          animation: pulse 4s ease-in-out infinite;
        }

        .floating-info {
          position: absolute;
          left: -20px;
          bottom: 10px;
          background: #fff;
          padding: 1.2rem 1.4rem;
          border-radius: 16px;
          box-shadow: 0 14px 30px rgba(15, 28, 63, 0.15);
          animation: float 8s ease-in-out infinite;
        }

        .section-nav {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 1.5rem;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 12px 28px rgba(15, 28, 63, 0.08);
          margin-bottom: 3rem;
        }

        .section-nav a {
          text-decoration: none;
          color: var(--deep-blue);
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          background: rgba(79, 209, 255, 0.12);
        }

        .feature-section,
        .catalog-section,
        .news-section {
          padding: 3.5rem 0;
        }

        .section-header {
          max-width: 620px;
          margin-bottom: 2.5rem;
        }

        .section-header h2 {
          font-size: clamp(2rem, 2.6vw, 2.6rem);
          margin-bottom: 1rem;
          color: var(--deep-blue);
        }

        .section-header p {
          color: var(--text-muted);
          font-size: 1.05rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          padding: 1.6rem;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 16px 30px rgba(15, 28, 63, 0.08);
          transition: transform 0.3s;
        }

        .feature-card.highlight {
          background: linear-gradient(145deg, rgba(79, 209, 255, 0.2), rgba(109, 92, 255, 0.12));
        }

        .feature-card:hover {
          transform: translateY(-6px);
        }

        .three-d-stage {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
          align-items: center;
          margin-top: 3rem;
        }

        .three-d-frame {
          perspective: 1000px;
        }

        .three-d-artifact {
          padding: 2.2rem;
          border-radius: 24px;
          background: linear-gradient(160deg, #0f1c3f, #1a2a5f);
          color: #fff;
          transform: rotateY(-18deg) rotateX(10deg);
          animation: drift 6s ease-in-out infinite;
          box-shadow: 0 30px 60px rgba(15, 28, 63, 0.35);
        }

        .three-d-label {
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
        }

        .three-d-details {
          display: grid;
          gap: 1.2rem;
        }

        .three-d-details strong {
          color: var(--deep-blue);
        }

        .catalog-grid,
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .catalog-card,
        .news-grid article {
          background: #fff;
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 14px 30px rgba(15, 28, 63, 0.08);
        }

        .catalog-card span {
          display: inline-flex;
          margin-top: 0.8rem;
          color: var(--accent-strong);
          font-weight: 600;
        }

        /* Header Styles */
        header.elementor-602 {
          background-color: rgba(255, 255, 255, 0.94);
          border-bottom: 1px solid rgba(15, 28, 63, 0.08);
          padding: 0.8em 0;
          position: sticky;
          top: 0;
          z-index: 1100;
          backdrop-filter: blur(12px);
        }

        .elementor-602 .elementor-element-c359326 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 0 2rem;
        }

        .elementor-nav-menu {
          display: flex;
          gap: 1.4rem;
          list-style: none;
        }

        .menu-link {
          text-decoration: none;
          color: var(--deep-blue);
          font-weight: 600;
          transition: color 0.2s;
        }

        .menu-link:hover {
          color: var(--accent-strong);
        }

        .logoh {
          width: 160px;
          height: 40px;
          background: linear-gradient(120deg, var(--deep-blue), var(--accent-strong));
          border-radius: 999px;
        }

        .e-search {
          background: #f1f5ff;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          display: flex;
          align-items: center;
        }

        .e-search-input {
          border: none;
          background: transparent;
          outline: none;
          padding-left: 0.6rem;
        }

        .langh .cpel-switcher__nav {
          background: #fff;
          border-radius: 999px;
          padding: 0.4rem 0.8rem;
          box-shadow: 0 8px 20px rgba(15, 28, 63, 0.1);
        }

        .logh {
          display: inline-flex;
          padding: 0.6rem 1.3rem;
          border-radius: 999px;
          background: var(--deep-blue);
          color: #fff;
          text-decoration: none;
          font-weight: 600;
        }

        /* Footer Styles */
        footer.elementor-1081 {
          background-color: #0b1224;
          padding: 3em 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .footer-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .footer-menu a {
          color: #d3d7e3;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-menu a:hover {
          color: #4fd1ff;
        }

        .adress {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .adress-line {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .elementor-social-icons-wrapper {
          display: flex;
          gap: 1em;
        }

        .elementor-social-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d3d7e3;
          transition: color 0.2s;
        }

        .elementor-social-icon:hover {
          color: #4fd1ff;
        }

        .elementor-button {
          background: linear-gradient(135deg, var(--accent), var(--accent-strong));
          border-radius: 999px;
          color: #0b0f1d;
          font-weight: 700;
        }

        /* Burger Menu Styles */
        .kz-burger-menu {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 4px;
          z-index: 1001;
        }

        .kz-burger-line {
          width: 25px;
          height: 3px;
          background-color: #1e293b;
          transition: all 0.3s;
        }

        .kz-burger-menu.active .kz-burger-line:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .kz-burger-menu.active .kz-burger-line:nth-child(2) {
          opacity: 0;
        }

        .kz-burger-menu.active .kz-burger-line:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .kz-fullscreen-menu {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1000;
          background-color: rgba(0, 0, 0, 0.95);
        }

        .kz-fullscreen-menu.active {
          display: flex;
        }

        .kz-menu-left {
          flex: 0 0 60%;
          padding: 3em;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kz-menu-nav {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .kz-menu-link {
          font-size: 2.5rem;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
          animation: slideIn 0.3s ease-out;
          animation-delay: calc(var(--i) * 0.1s);
        }

        .kz-menu-link:hover {
          color: #046bd2;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes drift {
          0%,
          100% {
            transform: rotateY(-18deg) rotateX(10deg);
          }
          50% {
            transform: rotateY(-10deg) rotateX(6deg);
          }
        }

      .kz-menu-right {
        flex: 0 0 40%;
        background-size: cover;
        background-position: center;
        position: relative;
      }

      .kz-menu-right-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .kz-menu-right-content {
        position: relative;
        z-index: 1;
        color: #ffffff;
        padding: 3em;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .kz-menu-right-content h2 {
        font-size: 2.5rem;
        margin-bottom: 0.5em;
      }

      .kz-menu-close {
        position: absolute;
        top: 2em;
        right: 2em;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 1001;
      }

      .kz-menu-close span {
        display: block;
        width: 100%;
        height: 3px;
        background-color: #ffffff;
        position: absolute;
        top: 50%;
      }

      .kz-menu-close span:first-child {
        transform: rotate(45deg);
      }

      .kz-menu-close span:last-child {
        transform: rotate(-45deg);
      }

        @media (max-width: 1024px) {
          .elementor-nav-menu--main {
            display: none;
          }

          .kz-burger-menu {
            display: flex;
          }
        }

        @media (max-width: 921px) {
          .elementor-602 .elementor-element-c359326 {
            padding: 0 1rem;
          }

          .kz-fullscreen-menu {
            flex-direction: column;
          }

          .kz-menu-left {
            flex: 1;
            width: 100%;
          }

          .kz-menu-right {
            display: none;
          }

          .floating-info {
            position: static;
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;
