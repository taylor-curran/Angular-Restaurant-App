import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dishService } from '../api/services';
import { Comment, Dish } from '../api/types';

type FormState = {
  author: string;
  rating: number;
  comment: string;
};

const initialForm: FormState = {
  author: '',
  rating: 5,
  comment: '',
};

export function DishDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialForm);
  const [showPreview, setShowPreview] = useState(false);

  const dishId = params.id ?? '';

  const dishIdsQuery = useQuery({
    queryKey: ['dish-ids'],
    queryFn: () => dishService.getDishIds(),
  });

  const dishQuery = useQuery({
    queryKey: ['dish', dishId],
    queryFn: () => dishService.getDish(dishId),
    enabled: Boolean(dishId),
  });

  const saveMutation = useMutation({
    mutationFn: (dish: Dish) => dishService.putDish(dish),
    onSuccess: (dish) => {
      queryClient.setQueryData(['dish', dish.id], dish);
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      setForm(initialForm);
      setShowPreview(false);
    },
  });

  const dish = dishQuery.data;
  const dishIds = dishIdsQuery.data ?? [];
  const index = dish && dishIds.length > 0 ? dishIds.indexOf(dish.id) : -1;
  const prev = index >= 0 ? dishIds[(dishIds.length + index - 1) % dishIds.length] : '';
  const next = index >= 0 ? dishIds[(dishIds.length + index + 1) % dishIds.length] : '';

  const authorError = useMemo(() => {
    if (!form.author) {
      return 'Author Name is required.';
    }
    if (form.author.length < 2) {
      return 'Author Name must be at least 2 characters long.';
    }
    if (form.author.length > 25) {
      return 'Author Name cannot be more than 25 characters long.';
    }
    return '';
  }, [form.author]);

  const commentError = form.comment ? '' : 'Comment is required.';
  const formValid = !authorError && !commentError;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!dish || !formValid) {
      return;
    }
    const newComment: Comment = {
      author: form.author,
      rating: form.rating,
      comment: form.comment,
      date: new Date().toISOString(),
    };
    saveMutation.mutate({
      ...dish,
      comments: [...dish.comments, newComment],
    });
  };

  if (dishQuery.isLoading) {
    return <section className="loading-section"><h4>Loading delicious details...</h4></section>;
  }

  if (dishQuery.isError || !dish) {
    return (
      <section className="error-section">
        <h2>Oops! Something went wrong</h2>
        <p>{String(dishQuery.error ?? '')}</p>
      </section>
    );
  }

  return (
    <div className="dish-detail-container">
      <section className="dish-card-wrapper">
        <article className="dish-card">
          <header className="dish-header">
            <div className="category-badge">{dish.category.toUpperCase()}</div>
            <h2>{dish.name.toUpperCase()}</h2>
          </header>
          <div className="image-container">
            <img src={dish.image} alt={dish.name} className="dish-image" />
          </div>
          <div className="dish-content">
            <p>{dish.description}</p>
          </div>
          <div className="dish-actions">
            {prev ? <Link to={`/dishdetail/${prev}`}>Previous</Link> : null}
            <button type="button" onClick={() => navigate(-1)}>Back to Menu</button>
            {next ? <Link to={`/dishdetail/${next}`}>Next</Link> : null}
          </div>
        </article>
      </section>

      <section className="comments-wrapper">
        <article className="comments-card">
          <h3>Customer Reviews ({dish.comments.length})</h3>
          <div className="comments-list">
            {dish.comments.map((comment, i) => (
              <article key={`${comment.author}-${comment.date}-${i}`} className="comment-item">
                <header className="comment-header">
                  <strong>{comment.author}</strong>
                  <span>{comment.rating}/5</span>
                </header>
                <p>{comment.comment}</p>
                <footer>{new Date(comment.date).toLocaleDateString()}</footer>
              </article>
            ))}
          </div>
        </article>

        {showPreview && formValid ? (
          <article className="preview-card">
            <h4>Preview Your Review</h4>
            <p>{form.comment}</p>
          </article>
        ) : null}

        <article className="review-form-card">
          <div className="form-header">
            <h3>Share Your Experience</h3>
            <button type="button" onClick={() => setShowPreview((current) => !current)}>
              {showPreview ? 'Hide preview' : 'Show preview'}
            </button>
          </div>
          <form className="review-form" onSubmit={onSubmit}>
            <label>
              Your Name
              <input
                value={form.author}
                onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
              />
            </label>
            {authorError ? <p className="error-message">{authorError}</p> : null}

            <label>
              Your Rating: {form.rating}/5
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={form.rating}
                onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
              />
            </label>

            <label>
              Your Review
              <textarea
                rows={4}
                value={form.comment}
                onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
              />
            </label>
            {commentError ? <p className="error-message">{commentError}</p> : null}

            <button type="submit" disabled={!formValid || saveMutation.isPending}>
              Submit Review
            </button>
          </form>
        </article>
      </section>
    </div>
  );
}
