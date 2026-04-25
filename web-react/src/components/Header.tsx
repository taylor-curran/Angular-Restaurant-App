import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, TextField } from '@mui/material';

const NAV_LINKS = [
  { to: '/home', icon: 'fa-home', label: 'Home' },
  { to: '/about', icon: 'fa-info-circle', label: 'About' },
  { to: '/menu', icon: 'fa-cutlery', label: 'Menu' },
  { to: '/contactus', icon: 'fa-address-card', label: 'Contact' },
];

export function Header() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const performSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/menu?search=${encodeURIComponent(q)}`);
      setSearchActive(false);
      setSearchQuery('');
    }
  };

  const openReservations = () => alert('Please contact us directly to make a reservation.');
  const callPhone = () => alert('Please contact us for our phone number.');

  return (
    <AppBar position="static" className="main-toolbar" elevation={2} component="header">
      <Toolbar>
        <div className="toolbar-content">
          <div className="brand-section">
            <Link to="/home" className="restaurant-name" data-testid="brand">
              <i className="fa fa-cutlery brand-icon" />
              <strong>L'Artisan Culinaire</strong>
            </Link>
          </div>
          <nav className="navigation-section desktop-nav" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                className="nav-link"
                aria-label={link.label}
              >
                <i className={`fa ${link.icon}`} />
                <span className="nav-text">{link.label}</span>
              </Button>
            ))}
          </nav>
          <div className="toolbar-actions">
            <IconButton
              className="action-button"
              aria-label="Search"
              onClick={() => setSearchActive((v) => !v)}
            >
              <i className="fa fa-search" />
            </IconButton>
            <IconButton className="action-button" aria-label="Reservations" onClick={openReservations}>
              <i className="fa fa-calendar" />
            </IconButton>
            <IconButton className="action-button" aria-label="Phone" onClick={callPhone}>
              <i className="fa fa-phone" />
            </IconButton>
          </div>
        </div>
      </Toolbar>
      {searchActive && (
        <div className="search-container active" style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.4)' }}>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && performSearch()}
            placeholder="Try 'pasta', 'steak', or 'dessert'"
            label="Search our menu..."
            size="small"
            variant="outlined"
            sx={{ background: 'white', borderRadius: 1, width: 320 }}
            slotProps={{ htmlInput: { 'aria-label': 'Search menu' } }}
          />
        </div>
      )}
    </AppBar>
  );
}
