import { CircularProgress } from '@mui/material';

interface Props {
  title?: string;
  subtitle?: string;
}

export function LoadingSection({
  title = 'Loading...',
  subtitle = 'Please wait',
}: Props) {
  return (
    <section className="loading-section" data-testid="loading">
      <div className="loading-content">
        <CircularProgress color="secondary" />
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
