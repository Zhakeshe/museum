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
                          {/* Add your main content sections here */}
                          <section id="museumkaz" className="section">
                            <h2>Музеи Казахстана</h2>
                            <p>Исследуйте богатую коллекцию музеев Казахстана</p>
                          </section>

                          <section id="models3dkaz" className="section">
                            <h2>3D модели</h2>
                            <p>Интерактивные 3D модели экспонатов</p>
                          </section>

                          <section id="museumexhibitkaz" className="section">
                            <h2>Государственный каталог</h2>
                            <p>Каталог музейных экспонатов</p>
                          </section>

                          <section id="newskaz" className="section">
                            <h2>Новости</h2>
                            <p>Последние новости из мира культуры</p>
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

        body {
          font-family: 'Nunito Sans', sans-serif;
          line-height: 1.65;
          color: #334155;
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

        .section {
          padding: 3em 0;
          margin-bottom: 2em;
        }

        .section h2 {
          font-size: 2.25rem;
          font-weight: 600;
          margin-bottom: 1em;
          color: #1e293b;
        }

        .section p {
          font-size: 1rem;
          line-height: 1.65;
        }

        /* Header Styles */
        header.elementor-602 {
          background-color: #ffffff;
          border-bottom: 1px solid #d1d5db;
          padding: 1em 0;
        }

        /* Footer Styles */
        footer.elementor-1081 {
          background-color: #f0f5fa;
          padding: 2em 0;
          border-top: 1px solid #d1d5db;
        }

        .footer-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .footer-menu a {
          color: #334155;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-menu a:hover {
          color: #046bd2;
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
          color: #334155;
          transition: color 0.2s;
        }

        .elementor-social-icon:hover {
          color: #046bd2;
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

      @media (max-width: 921px) {
        .kz-burger-menu {
          display: flex;
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
      }
      `}</style>
    </>
  );
};

export default HomePage;

