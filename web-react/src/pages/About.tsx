import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Leader } from '../shared/types';
import { getLeaders } from '../services/leaderService';
import { LoadingSection } from '../components/LoadingSection';
import { ErrorSection } from '../components/ErrorSection';

export function About() {
  const [leaders, setLeaders] = useState<Leader[] | null>(null);
  const [errMess, setErrMess] = useState<string | null>(null);

  const load = () => {
    setLeaders(null);
    setErrMess(null);
    getLeaders()
      .then(setLeaders)
      .catch((e) => setErrMess(String(e?.message ?? e)));
  };

  useEffect(load, []);

  return (
    <div className="container about-container">
      <section className="hero-section" id="hero">
        <div className="luxury-divider" />
        <h1 className="hero-title">
          <span>Our Story</span>
          <br />
          <span style={{ color: 'var(--gold)' }}>A Culinary Journey</span>
        </h1>
        <p className="hero-subtitle">
          A journey of passion, tradition, and culinary excellence that began with a simple dream: to create
          extraordinary dining experiences that touch the soul.
        </p>
        <div className="luxury-divider" />
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">13+</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Stars</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15K+</span>
            <span className="stat-label">Guests</span>
          </div>
        </div>
      </section>

      <section className="history-section" id="history">
        <div className="section-header">
          <span className="section-badge">
            <i className="fa fa-clock-o" /> Our Journey
          </span>
          <h2 className="section-title">Our Heritage</h2>
          <p className="section-description">
            From humble beginnings to culinary excellence, our journey spans over a decade of dedication to the art of
            fine dining.
          </p>
        </div>

        <div>
          <div className="timeline-item">
            <div className="timeline-header">
              <h3>2010 - The Beginning</h3>
              <span>2010</span>
            </div>
            <p>
              Founded in 2010, L'Artisan Culinaire emerged as a beacon of gastronomic excellence in the heart of the
              city. What began as a humble vision has evolved into one of the most prestigious dining destinations.
            </p>
          </div>
          <div className="timeline-item">
            <div className="timeline-header">
              <h3>2015 - Recognition</h3>
              <span>2015</span>
            </div>
            <p>
              Our journey traces back to <em>Le Petit Atelier</em>, a cherished family establishment started by our
              visionary founder, Chef Pierre Dubois, who introduced the world to the art of artisanal cuisine.
            </p>
          </div>
          <div className="timeline-item">
            <div className="timeline-header">
              <h3>2020 - Excellence</h3>
              <span>2020</span>
            </div>
            <p>
              Featuring the expertise of internationally acclaimed chefs and sommeliers, each visit promises a unique
              culinary adventure that celebrates the finest ingredients and innovative techniques.
            </p>
          </div>
        </div>
      </section>

      <section className="quote-section" style={{ margin: '32px 0' }}>
        <article className="luxury-card">
          <div className="card-content" style={{ textAlign: 'center', padding: 32 }}>
            <i className="fa fa-quote-left" style={{ fontSize: '2rem', color: 'var(--gold)' }} />
            <blockquote>
              <h3 style={{ fontStyle: 'italic' }}>
                "Cuisine is not just about food; it's about creating moments of pure joy and connection that linger in
                the memory long after the last bite."
              </h3>
              <footer>
                <strong>Chef Pierre Dubois</strong>
                <br />
                <span>Founder &amp; Executive Chef</span>
                <br />
                <cite>L'Artisan Culinaire: A Journey of Taste</cite>
              </footer>
            </blockquote>
          </div>
        </article>
      </section>

      <section className="leadership-section" id="leadership">
        <div className="section-header">
          <span className="section-badge">
            <i className="fa fa-users" /> Meet Our Team
          </span>
          <h2 className="section-title">Culinary Leadership</h2>
          <p className="section-description">
            Meet the master artisans who bring our vision to life, each bringing their unique expertise and passion to
            create extraordinary dining experiences.
          </p>
          <div>
            <span className="label-tag">{leaders ? leaders.length : 0} Master Chefs</span>
          </div>
        </div>

        {leaders && leaders.length > 0 && (
          <div className="leadership-grid" data-testid="leadership-grid">
            {leaders.map((leader) => (
              <article
                key={leader.id}
                className="leader-card"
                data-testid={`leader-card-${leader.id}`}
              >
                <div className="leader-image">
                  <img src={leader.image} alt={leader.name} className="leader-avatar" />
                </div>
                <div className="leader-info">
                  <h3 className="leader-name">{leader.name}</h3>
                  <span className="leader-title">{leader.designation}</span>
                  <p>{leader.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {!leaders && !errMess && (
          <LoadingSection
            title="Discovering our culinary masters..."
            subtitle="Please wait while we gather information about our exceptional team."
          />
        )}

        {errMess && (
          <ErrorSection
            title="Information Temporarily Unavailable"
            message={errMess}
            onRetry={load}
          />
        )}
      </section>

      <section style={{ textAlign: 'center', margin: '48px 0' }}>
        <h2>Experience Culinary Excellence</h2>
        <p>
          Join us for an unforgettable dining experience that celebrates the art of fine cuisine. Every moment is
          crafted with passion and precision.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary" component={Link} to="/menu" startIcon={<i className="fa fa-book" />}>
            View Our Menu
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/contactus" startIcon={<i className="fa fa-envelope" />}>
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
