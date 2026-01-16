import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  label: string;
  href: string;
  isAnchor?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Музеи Казахстана', href: '/museum' },
  { label: '3D модели', href: '/model-3d' },
  { label: 'Каталог', href: '/exhibit' },
  { label: 'Игры', href: '/news-article' },
  { label: 'Законодательство', href: '/zakonodatelstvo' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <header
      data-elementor-type="header"
      data-elementor-id="602"
      className="elementor elementor-602 elementor-location-header"
    >
      <div className="elementor-element elementor-element-c359326 e-grid e-con-full e-con e-parent">
        {/* Burger Menu */}
        <button
          className={`kz-burger-menu ${isMenuOpen ? 'active' : ''}`}
          id="kzBurgerMenu"
          onClick={toggleMenu}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="kzFullscreenMenu"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span className="kz-burger-line"></span>
          <span className="kz-burger-line"></span>
          <span className="kz-burger-line"></span>
        </button>

        {/* Fullscreen Menu */}
        <div
          className={`kz-fullscreen-menu ${isMenuOpen ? 'active' : ''}`}
          id="kzFullscreenMenu"
          aria-hidden={!isMenuOpen}
        >
          <div className="kz-menu-left">
            <button
              className="kz-menu-close"
              onClick={toggleMenu}
              type="button"
              aria-label="Закрыть меню"
            >
              <span></span>
              <span></span>
            </button>

            <nav className="kz-menu-nav">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="kz-menu-link"
                  style={{ ['--i' as any]: index + 1 }}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="kz-menu-footer">
              <div className="kz-menu-social">
                <a
                  href="https://www.instagram.com/nationalmuseumkz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kz-social-link"
                  aria-label="Instagram"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/www.qrum.kz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kz-social-link"
                  aria-label="Facebook"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
              <p className="kz-menu-copyright">© 2026 Музеи Казахстана</p>
            </div>
          </div>

          <div
            className="kz-menu-right"
            style={{
              backgroundImage: "url('/wp-content/uploads/sites/11/2025/11/slide.jpg')",
            }}
          >
            <div className="kz-menu-right-overlay"></div>
            <div className="kz-menu-right-content">
              <h2>Откройте для себя</h2>
              <p>богатую историю и культуру Казахстана</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Menu"
          className="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal"
        >
          <ul id="menu-1-3a233a6" className="elementor-nav-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="menu-item">
                <Link href={item.href} className="elementor-item menu-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logo */}
        <div className="elementor-element elementor-element-eeab1d3">
          <Link href="/">
            <div className="logoh" style={{ minWidth: '170px' }}></div>
          </Link>
        </div>

        {/* Search */}
        <div className="elementor-element elementor-element-361c23b">
          <search className="e-search" role="search">
            <form className="e-search-form" action="/" method="get">
              <label className="e-search-label" htmlFor="search-361c23b">
                <span className="elementor-screen-only">Search</span>
                <svg
                  aria-hidden="true"
                  className="e-font-icon-svg e-fas-search"
                  viewBox="0 0 512 512"
                >
                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                </svg>
              </label>
              <div className="e-search-input-wrapper">
                <input
                  id="search-361c23b"
                  placeholder="Поиск"
                  className="e-search-input"
                  type="search"
                  name="s"
                  autoComplete="off"
                />
              </div>
            </form>
          </search>
        </div>

        {/* Language Switcher */}
        <div className="elementor-element elementor-element-303a1b8 cpel-switcher--layout-dropdown langh">
          <nav className="cpel-switcher__nav">
            <div className="cpel-switcher__toggle cpel-switcher__lang">
              <a lang="ru-RU" href="/">
                <span className="cpel-switcher__name">Рус</span>
                <i className="cpel-switcher__icon fas fa-caret-down" aria-hidden="true"></i>
              </a>
            </div>
            <ul className="cpel-switcher__list">
              <li className="cpel-switcher__lang">
                <a lang="kk" href="/kk/main">
                  <span className="cpel-switcher__name">Қаз</span>
                </a>
              </li>
              <li className="cpel-switcher__lang">
                <a lang="en-US" href="/en/main">
                  <span className="cpel-switcher__name">Eng</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Login Link */}
        <div className="elementor-element elementor-element-42110f6">
          <a href="https://crm.e-museum.kz/" target="_blank" rel="noopener noreferrer" className="logh">
            Войти
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
