import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Dish, Leader, Promotion } from '../shared/types';
import { getFeaturedDish } from '../services/dishService';
import { getFeaturedLeader } from '../services/leaderService';
import { getFeaturedPromotion } from '../services/promotionService';
import { LoadingSection } from '../components/LoadingSection';
import { ErrorSection } from '../components/ErrorSection';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  badge: string;
  badgeIcon: string;
  image: string;
  imageAlt: string;
  description: string;
  badgeBottom: string;
  onClick?: () => void;
}

function FeatureCard({
  title,
  subtitle,
  badge,
  badgeIcon,
  image,
  imageAlt,
  description,
  badgeBottom,
  onClick,
}: FeatureCardProps) {
  return (
    <article
      className="luxury-card featured-card"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      data-testid={`feature-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="card-header">
        <div className="featured-avatar">
          <i className={`fa ${badgeIcon}`} aria-hidden />
        </div>
        <div>
          <h4 className="card-title">{title.toUpperCase()}</h4>
          <span className="card-subtitle">{subtitle.toUpperCase()}</span>
        </div>
      </div>
      <div className="image-container">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="card-content">
        <p>{description}</p>
        <div>
          <span className="label-tag">
            <i className={`fa ${badgeIcon}`} /> {badge}
          </span>
          <span className="label-tag">
            <i className="fa fa-tag" /> {badgeBottom}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Home() {
  const navigate = useNavigate();
  const [dish, setDish] = useState<Dish | null>(null);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [leader, setLeader] = useState<Leader | null>(null);
  const [dishErrMess, setDishErrMess] = useState<string | null>(null);
  const [promoErrMess, setPromoErrMess] = useState<string | null>(null);
  const [leadErrMess, setLeadErrMess] = useState<string | null>(null);

  useEffect(() => {
    getFeaturedDish()
      .then(setDish)
      .catch((e) => setDishErrMess(String(e?.message ?? e)));
    getFeaturedPromotion()
      .then(setPromotion)
      .catch((e) => setPromoErrMess(String(e?.message ?? e)));
    getFeaturedLeader()
      .then(setLeader)
      .catch((e) => setLeadErrMess(String(e?.message ?? e)));
  }, []);

  const isLoading =
    !dish && !promotion && !leader && !dishErrMess && !promoErrMess && !leadErrMess;
  const hasError = dishErrMess || promoErrMess || leadErrMess;

  return (
    <div className="container home-container">
      <section className="hero-section">
        <div className="hero-badge">
          <i className="fa fa-star" /> <span>Michelin Star Experience</span>
        </div>
        <h1 className="hero-title">Welcome to Culinary Excellence</h1>
        <p className="hero-description">
          Experience the pinnacle of gastronomic artistry where every dish tells a story of passion, tradition, and
          innovation. Our master chefs create unforgettable moments through the art of fine dining.
        </p>
        <div>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/menu"
            startIcon={<i className="fa fa-cutlery" />}
          >
            Explore Our Menu
          </Button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">25+</span>
            <span className="stat-label">Years of Excellence</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Michelin Stars</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Happy Guests</span>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <div className="section-badge">
            <i className="fa fa-diamond" /> <span>Signature Offerings</span>
          </div>
          <h2 className="section-title">Featured Highlights</h2>
          <p className="section-description">
            Discover our signature offerings and culinary masterpieces that define our legacy
          </p>
        </div>

        <div className="featured-grid">
          {dish && (
            <FeatureCard
              title={dish.name}
              subtitle={dish.category}
              badge={dish.label || "Chef's Special"}
              badgeIcon="fa-fire"
              image={dish.image}
              imageAlt={dish.name}
              description={dish.description}
              badgeBottom={`$${dish.price}`}
              onClick={() => navigate(`/dishdetail/${dish.id}`)}
            />
          )}

          {promotion && (
            <FeatureCard
              title={promotion.name}
              subtitle="Special Promotion"
              badge={promotion.label || 'Limited Time'}
              badgeIcon="fa-gift"
              image={promotion.image}
              imageAlt={promotion.name}
              description={promotion.description}
              badgeBottom={`$${promotion.price}`}
            />
          )}

          {leader && (
            <FeatureCard
              title={leader.name}
              subtitle={leader.designation}
              badge={leader.designation || 'Master Chef'}
              badgeIcon="fa-user"
              image={leader.image}
              imageAlt={leader.name}
              description={leader.description}
              badgeBottom={leader.abbr}
            />
          )}
        </div>
      </section>

      <section className="philosophy-section" style={{ marginTop: 48 }}>
        <div className="section-header">
          <div className="section-badge">
            <i className="fa fa-heart" /> <span>Our Values</span>
          </div>
          <h2 className="section-title">Our Philosophy</h2>
          <p className="section-description">
            The three pillars that guide our culinary journey and define our commitment to excellence
          </p>
        </div>
        <div className="philosophy-grid">
          <div className="philosophy-item">
            <div className="philosophy-icon">
              <i className="fa fa-leaf" />
            </div>
            <h4>Seasonal Excellence</h4>
            <p>
              We source only the finest seasonal ingredients from local artisans and sustainable farms, ensuring
              every dish reflects the bounty of nature and supports our community.
            </p>
          </div>
          <div className="philosophy-item">
            <div className="philosophy-icon">
              <i className="fa fa-heart" />
            </div>
            <h4>Artisanal Craftsmanship</h4>
            <p>
              Every dish is handcrafted with meticulous attention to detail, combining traditional techniques with
              innovative culinary artistry to create unforgettable flavors.
            </p>
          </div>
          <div className="philosophy-item">
            <div className="philosophy-icon">
              <i className="fa fa-glass" />
            </div>
            <h4>Curated Experience</h4>
            <p>
              From our carefully selected wine pairings to our elegant ambiance, every element is designed to create
              an unforgettable dining journey that transcends the ordinary.
            </p>
          </div>
        </div>
      </section>

      {isLoading && (
        <LoadingSection
          title="Preparing your culinary journey..."
          subtitle="Loading our finest offerings"
        />
      )}

      {hasError && (
        <ErrorSection
          message={[dishErrMess, promoErrMess, leadErrMess].filter(Boolean).join(' • ')}
        />
      )}
    </div>
  );
}
