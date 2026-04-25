import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Dish } from '../shared/types';
import { getDishes } from '../services/dishService';
import { LoadingSection } from '../components/LoadingSection';
import { ErrorSection } from '../components/ErrorSection';

export function Menu() {
  const [dishes, setDishes] = useState<Dish[] | null>(null);
  const [errMess, setErrMess] = useState<string | null>(null);

  const load = () => {
    setDishes(null);
    setErrMess(null);
    getDishes()
      .then(setDishes)
      .catch((e) => setErrMess(String(e?.message ?? e)));
  };

  useEffect(load, []);

  return (
    <div className="container menu-container">
      <section className="menu-header-section">
        <div className="section-header">
          <div className="luxury-divider"></div>
          <h2 className="section-title">Our Culinary Masterpieces</h2>
          <p className="section-description">
            Each dish is a testament to our commitment to culinary excellence, crafted with passion and the finest
            ingredients to create unforgettable dining experiences.
          </p>
          <div className="luxury-divider"></div>
        </div>
      </section>

      {dishes && dishes.length > 0 && (
        <section className="menu-content-section">
          <div className="menu-grid" data-testid="menu-grid">
            {dishes.map((dish) => (
              <Link
                key={dish.id}
                to={`/dishdetail/${dish.id}`}
                className="luxury-card menu-card"
                data-testid={`dish-card-${dish.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="image-container">
                  <img src={dish.image} alt={dish.name} />
                </div>
                <div className="card-content">
                  <h3 className="dish-name">{dish.name.toUpperCase()}</h3>
                  <p className="dish-description">{dish.description}</p>
                  <div className="dish-meta">
                    <span>
                      <i className="fa fa-tag" /> {dish.category}
                    </span>
                    <span className="price-tag">${dish.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {dishes && dishes.length === 0 && (
        <section className="loading-section">
          <h3>No dishes found</h3>
        </section>
      )}

      {!dishes && !errMess && (
        <LoadingSection
          title="Crafting your dining experience..."
          subtitle="Loading our finest culinary creations"
        />
      )}

      {errMess && (
        <ErrorSection
          title="Menu Temporarily Unavailable"
          message={errMess}
          onRetry={load}
        />
      )}

      <section className="menu-cta-section" style={{ textAlign: 'center', marginTop: 32 }}>
        <h3>Ready to Experience Our Menu?</h3>
        <p>Explore our culinary creations and discover your next favorite dish.</p>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/contactus"
          startIcon={<i className="fa fa-envelope" />}
        >
          Contact Us
        </Button>
      </section>
    </div>
  );
}
