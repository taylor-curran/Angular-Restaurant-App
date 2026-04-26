import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getFeaturedDish,
  getFeaturedLeader,
  getFeaturedPromotion,
} from '../api/services';

export function HomePage() {
  const dishQuery = useQuery({ queryKey: ['featured-dish'], queryFn: getFeaturedDish });
  const promotionQuery = useQuery({ queryKey: ['featured-promotion'], queryFn: getFeaturedPromotion });
  const leaderQuery = useQuery({ queryKey: ['featured-leader'], queryFn: getFeaturedLeader });

  const dish = dishQuery.data;
  const promotion = promotionQuery.data;
  const leader = leaderQuery.data;
  const hasError = dishQuery.error || promotionQuery.error || leaderQuery.error;
  const isLoading = !dish && !promotion && !leader && !hasError;

  return (
    <div className="container home-container">
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa fa-star" />
            <span>Michelin Star Experience</span>
          </div>
          <h1 className="hero-title">Welcome to Culinary Excellence</h1>
          <p className="hero-description">
            Experience the pinnacle of gastronomic artistry where every dish tells a story of passion,
            tradition, and innovation.
          </p>
          <div className="hero-actions">
            <Link className="hero-button primary" to="/menu">
              <i className="fa fa-cutlery" />
              Explore Our Menu
            </Link>
          </div>
        </div>
      </section>

      {(dish || promotion || leader) && (
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">Featured Highlights</h2>
          </div>
          <div className="featured-grid">
            {dish ? (
              <Link className="featured-item featured-card" to={`/dishdetail/${dish.id}`}>
                <div className="card-badge">Chef&apos;s Special</div>
                <h4>{dish.name.toUpperCase()}</h4>
                <img src={dish.image} alt={dish.name} />
                <p>{dish.description}</p>
              </Link>
            ) : null}
            {promotion ? (
              <div className="featured-item featured-card">
                <div className="card-badge promotion-badge">Limited Time</div>
                <h4>{promotion.name.toUpperCase()}</h4>
                <img src={promotion.image} alt={promotion.name} />
                <p>{promotion.description}</p>
              </div>
            ) : null}
            {leader ? (
              <div className="featured-item featured-card">
                <div className="card-badge leader-badge">{leader.designation}</div>
                <h4>{leader.name.toUpperCase()}</h4>
                <img src={leader.image} alt={leader.name} />
                <p>{leader.description}</p>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {isLoading ? (
        <section className="loading-section">
          <div className="loading-content">
            <h4>Preparing your culinary journey...</h4>
            <p>Loading our finest offerings</p>
          </div>
        </section>
      ) : null}

      {hasError ? (
        <section className="error-section">
          <div className="error-content">
            <h2>Service Temporarily Unavailable</h2>
            {dishQuery.error ? <p>{dishQuery.error.message}</p> : null}
            {promotionQuery.error ? <p>{promotionQuery.error.message}</p> : null}
            {leaderQuery.error ? <p>{leaderQuery.error.message}</p> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
