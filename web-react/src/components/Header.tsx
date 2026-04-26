import { FormEvent, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export function Header() {
  const [searchActive, setSearchActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hasNewNotifications = true;
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const toolbar = document.querySelector('.main-toolbar');
      if (!toolbar) {
        return;
      }
      if (window.scrollY > 50) {
        toolbar.classList.add('scrolled');
      } else {
        toolbar.classList.remove('scrolled');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuActive ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuActive]);

  useEffect(() => {
    if (!searchActive) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      const searchInput = document.querySelector('.search-field input') as HTMLInputElement | null;
      searchInput?.focus();
    }, 100);
    return () => window.clearTimeout(timeoutId);
  }, [searchActive]);

  const toggleSearch = () => {
    setSearchActive((active) => !active);
    if (searchActive) {
      setSearchQuery('');
    }
  };

  const performSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      return;
    }
    navigate(`/menu?search=${encodeURIComponent(query)}`);
    setSearchActive(false);
    setSearchQuery('');
  };

  const toggleMobileMenu = () => {
    setMobileMenuActive((active) => !active);
  };

  return (
    <>
      <header className="main-toolbar">
        <div className="toolbar-content">
          <div className="brand-section">
            <Link className="restaurant-name" to="/home">
              <i className="fa fa-cutlery brand-icon" />
              <strong>L'Artisan Culinaire</strong>
            </Link>
          </div>

          <nav className="navigation-section desktop-nav">
            <NavLink className="nav-link" to="/home">
              <i className="fa fa-home" />
              <span className="nav-text">Home</span>
            </NavLink>
            <NavLink className="nav-link" to="/about">
              <i className="fa fa-info-circle" />
              <span className="nav-text">About</span>
            </NavLink>
            <NavLink className="nav-link" to="/menu">
              <i className="fa fa-cutlery" />
              <span className="nav-text">Menu</span>
            </NavLink>
            <NavLink className="nav-link" to="/contactus">
              <i className="fa fa-address-card" />
              <span className="nav-text">Contact</span>
            </NavLink>
          </nav>

          <div className="toolbar-actions">
            <button aria-label="Search" className="action-button" type="button" onClick={toggleSearch}>
              <i className="fa fa-search" />
            </button>
            <button
              aria-label="Reservations"
              className="action-button"
              type="button"
              onClick={() => window.alert('Please contact us directly to make a reservation.')}
            >
              <i className="fa fa-calendar" />
              {hasNewNotifications && <span className="notification-badge">!</span>}
            </button>
            <button
              aria-label="Phone"
              className="action-button"
              type="button"
              onClick={() => window.alert('Please contact us for our phone number.')}
            >
              <i className="fa fa-phone" />
            </button>
            <button aria-label="Menu" className="mobile-menu-toggle" type="button" onClick={toggleMobileMenu}>
              <i className="fa fa-bars" />
            </button>
          </div>
        </div>

        <div className={`search-container ${searchActive ? 'active' : ''}`}>
          <form className="search-content" onSubmit={performSearch}>
            <label className="search-field">
              <span>Search our menu...</span>
              <input
                placeholder="Try 'pasta', 'steak', or 'dessert'"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <button className="close-search" type="button" onClick={toggleSearch}>
              <i className="fa fa-times" />
            </button>
          </form>
        </div>
      </header>

      <div
        className={`mobile-menu ${mobileMenuActive ? 'active' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            toggleMobileMenu();
          }
        }}
      >
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <h3>Menu</h3>
            <button type="button" onClick={toggleMobileMenu}>
              <i className="fa fa-times" />
            </button>
          </div>
          <nav className="mobile-nav">
            <NavLink className="mobile-nav-link" to="/home" onClick={toggleMobileMenu}>
              <i className="fa fa-home" />
              <span>Home</span>
            </NavLink>
            <NavLink className="mobile-nav-link" to="/about" onClick={toggleMobileMenu}>
              <i className="fa fa-info-circle" />
              <span>About</span>
            </NavLink>
            <NavLink className="mobile-nav-link" to="/menu" onClick={toggleMobileMenu}>
              <i className="fa fa-cutlery" />
              <span>Menu</span>
            </NavLink>
            <NavLink className="mobile-nav-link" to="/contactus" onClick={toggleMobileMenu}>
              <i className="fa fa-address-card" />
              <span>Contact</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
}
