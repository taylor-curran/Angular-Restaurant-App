import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function isToday(day: string): boolean {
  const today = new Date().getDay();
  if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day)) {
    return today >= 1 && today <= 5;
  }
  if (day === 'saturday') return today === 6;
  if (day === 'sunday') return today === 0;
  return false;
}

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.pageYOffset > 300);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
                Experience the pinnacle of gastronomic excellence with our master chefs who craft each dish with passion.
              </p>
            </div>
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                alert('Please contact us directly for reservations.')
              }
              startIcon={<i className="fa fa-calendar-check-o" aria-hidden />}
            >
              Make a Reservation
            </Button>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <nav className="footer-nav" role="navigation" aria-label="Footer Navigation">
              <Button component={Link} to="/home" className="footer-link">
                <i className="fa fa-home" aria-hidden />
                <span>Home</span>
              </Button>
              <Button component={Link} to="/about" className="footer-link">
                <i className="fa fa-info-circle" aria-hidden />
                <span>About Us</span>
              </Button>
              <Button component={Link} to="/menu" className="footer-link">
                <i className="fa fa-cutlery" aria-hidden />
                <span>Our Menu</span>
              </Button>
              <Button component={Link} to="/contactus" className="footer-link">
                <i className="fa fa-address-card" aria-hidden />
                <span>Contact</span>
              </Button>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact &amp; Hours</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fa fa-map-marker" aria-hidden />
                <span>121, Clear Water Bay Road, Kowloon, HONG KONG</span>
              </div>
              <div className="contact-item">
                <i className="fa fa-phone" aria-hidden />
                <span>Contact us for phone number</span>
              </div>
              <div className="contact-item">
                <i className="fa fa-envelope" aria-hidden />
                <a href="mailto:info@lartisanculinaire.com">info@lartisanculinaire.com</a>
              </div>
            </div>
            <div className="hours-info" style={{ marginTop: 12 }}>
              <div className={`hours-item${isToday('monday') ? ' today' : ''}`}>
                <span className="day">Mon-Fri:</span>
                <span className="time">6:00 PM - 11:00 PM</span>
              </div>
              <div className={`hours-item${isToday('saturday') ? ' today' : ''}`}>
                <span className="day">Sat:</span>
                <span className="time">5:30 PM - 11:30 PM</span>
              </div>
              <div className={`hours-item${isToday('sunday') ? ' today' : ''}`}>
                <span className="day">Sun:</span>
                <span className="time">5:00 PM - 10:30 PM</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} L'Artisan Culinaire. All rights reserved.</p>
            </div>
            <div className="footer-badges">
              <span className="footer-badge" title="Michelin Starred Restaurant">
                <i className="fa fa-star" aria-hidden /> Michelin Starred
              </span>
              <span className="footer-badge" title="Farm to Table Ingredients">
                <i className="fa fa-leaf" aria-hidden /> Farm to Table
              </span>
            </div>
          </div>
        </div>
      </div>
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <i className="fa fa-chevron-up" aria-hidden />
        </button>
      )}
    </footer>
  );
}
