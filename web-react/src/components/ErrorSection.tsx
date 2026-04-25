import { Button } from '@mui/material';

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorSection({
  title = 'Service Temporarily Unavailable',
  message,
  onRetry,
}: Props) {
  return (
    <section className="error-section" data-testid="error">
      <div className="error-content">
        <i className="fa fa-exclamation-triangle error-icon" aria-hidden />
        <h2>{title}</h2>
        <p>{message}</p>
        {onRetry && (
          <Button variant="contained" color="secondary" onClick={onRetry}>
            <i className="fa fa-refresh" /> Try Again
          </Button>
        )}
      </div>
    </section>
  );
}
