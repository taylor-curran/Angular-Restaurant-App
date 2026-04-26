import { Link, NavLink } from 'react-router-dom';

function isToday(day: string): boolean {
  const today = new Date().getDay();
  if (day === 'monday') return today >= 1 && today <= 5;
  if (day === 'saturday') return today === 6;
  if (day === 'sunday') return today === 0;
  return false;
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-container" role="contentinfo">
      <div className="container">
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="brand-name">L'Artisan Culinaire</h3>
              <p className="brand-tagline">Where culinary artistry meets timeless elegance</p>
            </div>
            <div className="footer-description">
              <p>
                Experience the pinnacle of gastronomic excellence with our master chefs who craft
                each dish with passion.
              </p>
            </div>
            <button
              className="reservation-btn"
              onClick={() => window.alert('Please contact us directly for reservations.')}
            >
              <i className="fa fa-calendar-check-o" aria-hidden="true" />
              Make a Reservation
            </button>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <nav className="footer-nav" role="navigation" aria-label="Footer Navigation">
              <NavLink to="/home" className="footer-link">
                <i className="fa fa-home" aria-hidden="true" />
                <span>Home</span>
              </NavLink>
              <NavLink to="/about" className="footer-link">
                <i className="fa fa-info-circle" aria-hidden="true" />
                <span>About Us</span>
              </NavLink>
              <NavLink to="/menu" className="footer-link">
                <i className="fa fa-cutlery" aria-hidden="true" />
                <span>Our Menu</span>
              </NavLink>
              <NavLink to="/contactus" className="footer-link">
                <i className="fa fa-address-card" aria-hidden="true" />
                <span>Contact</span>
              </NavLink>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact &amp; Hours</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fa fa-map-marker" aria-hidden="true" />
                <span>121, Clear Water Bay Road, Kowloon, HONG KONG</span>
              </div>
              <div className="contact-item">
                <i className="fa fa-phone" aria-hidden="true" />
                <span>Contact us for phone number</span>
              </div>
              <div className="contact-item">
                <i className="fa fa-envelope" aria-hidden="true" />
                <a href="mailto:info@lartisanculinaire.com">info@lartisanculinaire.com</a>
              </div>
            </div>
            <div className="hours-info">
              <div className={`hours-item ${isToday('monday') ? 'today' : ''}`}>
                <span className="day">Mon-Fri:</span>
                <span className="time">6:00 PM - 11:00 PM</span>
              </div>
              <div className={`hours-item ${isToday('saturday') ? 'today' : ''}`}>
                <span className="day">Sat:</span>
                <span className="time">5:30 PM - 11:30 PM</span>
              </div>
              <div className={`hours-item ${isToday('sunday') ? 'today' : ''}`}>
                <span className="day">Sun:</span>
                <span className="time">5:00 PM - 10:30 PM</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-divider" />
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {year} L'Artisan Culinaire. All rights reserved.</p>
            </div>
            <div className="footer-badges">
              <span className="footer-badge" title="Michelin Starred Restaurant">
                <i className="fa fa-star" aria-hidden="true" />
                Michelin Starred
              </span>
              <span className="footer-badge" title="Farm to Table Ingredients">
                <i className="fa fa-leaf" aria-hidden="true" />
                Farm to Table
              </span>
            </div>
          </div>
        </div>
      </div>
      <Link to="#top" className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fa fa-chevron-up" aria-hidden="true" />
      </Link>
    </footer>
  );
}
