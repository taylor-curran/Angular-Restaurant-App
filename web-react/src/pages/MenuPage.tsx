import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Dish } from '../api/types';
import { dishService } from '../api/services';

export function MenuPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';

  const { data: dishes, isLoading, error, refetch } = useQuery({
    queryKey: ['dishes'],
    queryFn: () => dishService.getDishes(),
  });

  const categories = useMemo(() => {
    if (!dishes) {
      return [];
    }
    return [...new Set(dishes.map((dish) => dish.category))];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    if (!dishes) {
      return [];
    }

    return dishes.filter((dish) => {
      const categoryMatches = !selectedCategory || dish.category === selectedCategory;
      const searchMatches =
        !search ||
        dish.name.toLowerCase().includes(search) ||
        dish.description.toLowerCase().includes(search) ||
        dish.category.toLowerCase().includes(search);
      return categoryMatches && searchMatches;
    });
  }, [dishes, selectedCategory, search]);

  function toggleFavorite(dish: Dish) {
    setFavorites((prev) => ({
      ...prev,
      [dish.id]: !prev[dish.id],
    }));
  }

  function getFeaturedDishesCount() {
    return (dishes ?? []).filter((dish) => dish.featured).length;
  }

  function getFavoriteDishesCount() {
    return Object.values(favorites).filter(Boolean).length;
  }

  if (isLoading) {
    return (
      <section className="loading-section">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-ring" />
            <div className="spinner-ring" />
            <div className="spinner-ring" />
          </div>
          <h4>Crafting your dining experience...</h4>
          <p>Loading our finest culinary creations</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="error-section">
        <div className="error-content">
          <div className="error-icon">
            <i className="fa fa-exclamation-triangle" />
          </div>
          <h2>Menu Temporarily Unavailable</h2>
          <h4>{error.message}</h4>
          <button className="retry-button" onClick={() => void refetch()}>
            <i className="fa fa-refresh" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="container menu-container">
      <section className="menu-header-section">
        <div className="section-header">
          <div className="luxury-divider" />
          <h2 className="section-title">Our Culinary Masterpieces</h2>
          <p className="section-description">
            Each dish is a testament to our commitment to culinary excellence, crafted with passion
            and the finest ingredients to create unforgettable dining experiences.
          </p>
          <div className="luxury-divider" />
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-container">
          <div className="filter-header">
            <h3 className="filter-title">Filter by Category</h3>
            <button
              className="clear-filters-btn"
              onClick={() => setSelectedCategory(null)}
              style={{ visibility: selectedCategory ? 'visible' : 'hidden' }}
            >
              <i className="fa fa-times" />
              Clear Filters
            </button>
          </div>
          <div className="filter-chips">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-chip ${selectedCategory === category ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <i className="fa fa-tag" />
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="menu-stats-section">
        <div className="stats-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fa fa-cutlery" />
              </div>
              <div className="stat-number">{filteredDishes.length}</div>
              <div className="stat-label">Available Dishes</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fa fa-star" />
              </div>
              <div className="stat-number">{categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fa fa-leaf" />
              </div>
              <div className="stat-number">{getFeaturedDishesCount()}</div>
              <div className="stat-label">Featured Dishes</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fa fa-heart" />
              </div>
              <div className="stat-number">{getFavoriteDishesCount()}</div>
              <div className="stat-label">Your Favorites</div>
            </div>
          </div>
        </div>
      </section>

      <section className="menu-content-section">
        {filteredDishes.length > 0 ? (
          <div className="menu-grid">
            {filteredDishes.map((dish, i) => (
              <Link
                key={dish.id}
                to={`/dishdetail/${dish.id}`}
                className="menu-item"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <article className="menu-card">
                  <div className="image-container">
                    <img src={dish.image} alt={dish.name} />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <i className="fa fa-cutlery" />
                        <span className="overlay-text">View Details</span>
                      </div>
                    </div>
                    <div className="dish-badge">
                      <span className="luxury-badge small">
                        <i className="fa fa-star" />
                        Chef&apos;s Selection
                      </span>
                    </div>
                    <div className="price-badge">
                      <span className="price-tag">${dish.price}</span>
                    </div>
                  </div>

                  <div className="menu-card-content">
                    <div className="dish-header">
                      <h3 className="dish-name">{dish.name.toUpperCase()}</h3>
                      <div className="dish-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className="fa fa-star" />
                        ))}
                      </div>
                    </div>

                    <p className="dish-description">{dish.description}</p>

                    <div className="dish-meta">
                      <div className="dish-category">
                        <i className="fa fa-tag" />
                        <span>{dish.category}</span>
                      </div>
                      <div className="dish-features">
                        {dish.featured ? (
                          <span className="feature-tag">
                            <i className="fa fa-fire" />
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="dish-actions">
                      <button className="view-details-btn" type="button">
                        <i className="fa fa-eye" />
                        View Details
                      </button>
                      <button
                        className={`favorite-btn ${favorites[dish.id] ? 'favorited' : ''}`}
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          toggleFavorite(dish);
                        }}
                        aria-label="Toggle favorite"
                      >
                        <i className={`fa ${favorites[dish.id] ? 'fa-heart' : 'fa-heart-o'}`} />
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-results-section">
            <div className="no-results-content">
              <div className="no-results-icon">
                <i className="fa fa-search" />
              </div>
              <h3>No dishes found</h3>
              <p>Try selecting a different category or clearing your filters</p>
              <button onClick={() => setSelectedCategory(null)}>
                <i className="fa fa-refresh" />
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="menu-cta-section">
        <div className="cta-content">
          <h3 className="cta-title">Ready to Experience Our Menu?</h3>
          <p className="cta-description">
            Explore our culinary creations and discover your next favorite dish.
          </p>
          <div className="cta-actions">
            <Link className="cta-button" to="/contactus">
              <i className="fa fa-envelope" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
