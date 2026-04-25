import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  IconButton,
  TextField,
  Slider,
  CircularProgress,
} from '@mui/material';
import { Comment, Dish } from '../shared/types';
import { getDish, getDishIds, putDish } from '../services/dishService';
import { ErrorSection } from '../components/ErrorSection';

interface FormState {
  author: string;
  rating: number;
  comment: string;
}

interface FormErrors {
  author: string;
  comment: string;
}

const initialForm: FormState = { author: '', rating: 5, comment: '' };

function validateField(field: keyof FormErrors, value: string): string {
  if (field === 'author') {
    if (!value) return 'Author Name is required. ';
    let msg = '';
    if (value.length < 2) msg += 'Author Name must be at least 2 characters long. ';
    if (value.length > 25) msg += 'Author Name cannot be more than 25 characters long. ';
    return msg;
  }
  if (field === 'comment') {
    if (!value) return 'Comment is required. ';
    return '';
  }
  return '';
}

function isFormValid(form: FormState): boolean {
  return (
    form.author.length >= 2 &&
    form.author.length <= 25 &&
    form.comment.length > 0 &&
    form.rating >= 1 &&
    form.rating <= 5
  );
}

export function DishDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [dish, setDish] = useState<Dish | null>(null);
  const [dishIds, setDishIds] = useState<string[]>([]);
  const [errMess, setErrMess] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    getDishIds().then(setDishIds);
  }, []);

  useEffect(() => {
    setDish(null);
    setErrMess(null);
    getDish(id)
      .then(setDish)
      .catch((e) => setErrMess(String(e?.message ?? e)));
  }, [id]);

  const { prev, next } = useMemo(() => {
    if (!dishIds.length) return { prev: id, next: id };
    const i = dishIds.indexOf(id);
    if (i === -1) return { prev: id, next: id };
    const len = dishIds.length;
    return {
      prev: dishIds[(len + i - 1) % len],
      next: dishIds[(len + i + 1) % len],
    };
  }, [dishIds, id]);

  const errors: FormErrors = {
    author: touched.author ? validateField('author', form.author) : '',
    comment: touched.comment ? validateField('comment', form.comment) : '',
  };
  const formValid = isFormValid(form);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish || !formValid) return;
    const newComment: Comment = {
      author: form.author,
      rating: form.rating,
      comment: form.comment,
      date: new Date().toISOString(),
    };
    const updated: Dish = {
      ...dish,
      comments: [...dish.comments, newComment],
    };
    try {
      const saved = await putDish(updated);
      // Some backends (json-server) return the body we sent without re-mapping;
      // fall back to local state update so the UI shows the new comment.
      setDish(saved && Array.isArray(saved.comments) ? saved : updated);
    } catch (err) {
      setDish(null);
      setErrMess(String((err as Error).message ?? err));
      return;
    }
    setForm(initialForm);
    setTouched({});
    setShowPreview(false);
  };

  if (errMess) {
    return (
      <div className="container">
        <ErrorSection
          title="Oops! Something went wrong"
          message={errMess}
          onRetry={() => navigate(-1)}
        />
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="container loading-container" data-testid="loading">
        <div className="loading-content" style={{ textAlign: 'center', padding: 48 }}>
          <CircularProgress color="secondary" />
          <h3>Loading delicious details...</h3>
          <p>Please wait while we prepare your dish information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dish-detail-container">
      <article className="luxury-card dish-card" data-testid="dish-card">
        <div className="card-header">
          <div>
            <span className="label-tag">{dish.category.toUpperCase()}</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', margin: '8px 0 0', color: 'var(--ivory)' }}>
              {dish.name.toUpperCase()}
            </h2>
            {dish.price && <span style={{ color: 'var(--gold)' }}>${dish.price}</span>}
          </div>
        </div>
        <div className="image-container">
          <img src={dish.image} alt={dish.name} className="dish-image" />
        </div>
        <div className="card-content">
          <h3>About This Dish</h3>
          <p>{dish.description}</p>
          {dish.label && (
            <>
              <h3>Special Features</h3>
              <span className="label-tag">{dish.label}</span>
            </>
          )}
        </div>
        <div className="action-buttons">
          <IconButton
            color="primary"
            component={Link}
            to={`/dishdetail/${prev}`}
            aria-label="Previous Dish"
            data-testid="prev-dish"
          >
            <i className="fa fa-chevron-left" />
          </IconButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/menu')}
            startIcon={<i className="fa fa-arrow-left" />}
            data-testid="back-to-menu"
          >
            Back to Menu
          </Button>
          <IconButton
            color="primary"
            component={Link}
            to={`/dishdetail/${next}`}
            aria-label="Next Dish"
            data-testid="next-dish"
          >
            <i className="fa fa-chevron-right" />
          </IconButton>
        </div>
      </article>

      <div>
        <article className="luxury-card comments-card" data-testid="comments-card">
          <div className="card-header">
            <i className="fa fa-comments" style={{ color: 'var(--gold)' }} />
            <h3 className="card-title">
              Customer Reviews <span className="comment-count">({dish.comments.length})</span>
            </h3>
          </div>
          <div className="card-content">
            {dish.comments.length > 0 ? (
              <div className="comments-list">
                {dish.comments.map((c, i) => (
                  <div key={i} className="comment-item" data-testid={`comment-${i}`}>
                    <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="comment-author">
                        <i className="fa fa-user" /> {c.author}
                      </span>
                      <span className="comment-rating">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i
                            key={s}
                            className={`fa ${s <= c.rating ? 'fa-star' : 'fa-star-o'}`}
                            aria-hidden
                          />
                        ))}{' '}
                        {c.rating}/5
                      </span>
                    </div>
                    <p>{c.comment}</p>
                    <span className="comment-date">
                      {c.date ? new Date(c.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-comments">
                <i className="fa fa-comment-o no-comments-icon" />
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </article>

        {formValid && showPreview && (
          <article className="luxury-card" data-testid="comment-preview" style={{ marginTop: 16 }}>
            <div className="card-header">
              <i className="fa fa-eye" style={{ color: 'var(--gold)' }} />
              <h4 className="card-title">Preview Your Review</h4>
            </div>
            <div className="card-content">
              <div className="comment-item" style={{ borderBottom: 'none' }}>
                <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="comment-author">
                    <i className="fa fa-user" /> {form.author}
                  </span>
                  <span className="comment-rating">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i key={s} className={`fa ${s <= form.rating ? 'fa-star' : 'fa-star-o'}`} aria-hidden />
                    ))}{' '}
                    {form.rating}/5
                  </span>
                </div>
                <p>{form.comment}</p>
                <span className="comment-date">Just now</span>
              </div>
            </div>
          </article>
        )}

        <article className="luxury-card review-form-card" style={{ marginTop: 16 }}>
          <div className="card-header" style={{ justifyContent: 'space-between' }}>
            <h4 className="card-title">
              <i className="fa fa-plus-circle" /> Share Your Experience
            </h4>
            {formValid && (
              <IconButton
                onClick={() => setShowPreview((s) => !s)}
                aria-label="Toggle Preview"
                sx={{ color: 'var(--ivory)' }}
              >
                <i className={`fa ${showPreview ? 'fa-eye-slash' : 'fa-eye'}`} />
              </IconButton>
            )}
          </div>
          <div className="card-content">
            <form noValidate onSubmit={handleSubmit} className="feedback-form" data-testid="comment-form">
              <TextField
                label="Your Name"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                onBlur={() => setTouched({ ...touched, author: true })}
                required
                fullWidth
                variant="outlined"
                error={Boolean(errors.author)}
                helperText={errors.author || ' '}
                slotProps={{ htmlInput: { 'aria-label': 'author' } }}
              />

              <div className="rating-section">
                <label style={{ display: 'block', marginBottom: 8 }}>
                  Your Rating: {form.rating}/5
                </label>
                <Slider
                  value={form.rating}
                  onChange={(_, v) => setForm({ ...form, rating: v as number })}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  aria-label="rating"
                />
              </div>

              <TextField
                label="Your Review"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                onBlur={() => setTouched({ ...touched, comment: true })}
                required
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                error={Boolean(errors.comment)}
                helperText={errors.comment || ' '}
                slotProps={{ htmlInput: { 'aria-label': 'comment' } }}
              />

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={!formValid}
                  startIcon={<i className="fa fa-paper-plane" />}
                  data-testid="submit-review"
                >
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  );
}
