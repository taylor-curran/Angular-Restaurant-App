import { useQuery } from '@tanstack/react-query';
import { getLeaders } from '../api/services';

export function AboutPage() {
  const { data: leaders, error, isLoading, refetch } = useQuery({
    queryKey: ['leaders'],
    queryFn: getLeaders,
  });

  return (
    <div className="about-container">
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-particles"></div>
        </div>
        <div className="hero-content">
          <div className="luxury-divider"></div>
          <h1 className="hero-title">
            <span className="title-line">Our Story</span>
            <span className="title-accent">A Culinary Journey</span>
          </h1>
          <p className="hero-subtitle">
            A journey of passion, tradition, and culinary excellence that began with a simple dream:
            to create extraordinary dining experiences that touch the soul.
          </p>
          <div className="luxury-divider"></div>
        </div>
      </section>

      <section className="leadership-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Meet Our Team</span>
            <h2 className="section-title">Culinary Leadership</h2>
            <p className="section-description">
              Meet the master artisans who bring our vision to life.
            </p>
            <div className="leadership-stats">
              <span className="luxury-badge">{leaders ? leaders.length : 0} Master Chefs</span>
            </div>
          </div>

          {leaders && leaders.length > 0 && (
            <div className="leadership-grid">
              {leaders.map((leader) => (
                <div key={leader.id} className="leader-card">
                  <div className="leader-image">
                    <img src={leader.image} alt={leader.name} className="leader-avatar" />
                    <div className="leader-overlay"></div>
                    <div className="leader-badge">
                      <i className="fa fa-star"></i>
                    </div>
                  </div>
                  <div className="leader-info">
                    <h3 className="leader-name">{leader.name}</h3>
                    <span className="leader-title">{leader.designation}</span>
                    <p className="leader-description">{leader.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {leaders && leaders.length === 0 && (
            <div className="no-leaders-message">
              <div className="no-leaders-content">
                <i className="fa fa-users"></i>
                <h3>Our Team Information</h3>
                <p>Information about our culinary leadership team will be available soon.</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="loading-section">
              <div className="loading-content">
                <h4>Discovering our culinary masters...</h4>
              </div>
            </div>
          )}

          {error && (
            <div className="error-section">
              <div className="error-content">
                <i className="fa fa-exclamation-triangle error-icon"></i>
                <h2>Information Temporarily Unavailable</h2>
                <h4>{String(error)}</h4>
                <button className="retry-btn" type="button" onClick={() => refetch()}>
                  <i className="fa fa-refresh"></i> Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
