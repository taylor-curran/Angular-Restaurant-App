import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { ContactType, Feedback } from '../shared/types';
import { putFeedback } from '../services/feedbackService';

interface FormState {
  firstname: string;
  lastname: string;
  telnum: number;
  email: string;
  agree: boolean;
  contacttype: string;
  message: string;
}

interface FormErrors {
  firstname: string;
  lastname: string;
  telnum: string;
  email: string;
}

const initialForm: FormState = {
  firstname: '',
  lastname: '',
  telnum: 0,
  email: '',
  agree: false,
  contacttype: 'None',
  message: '',
};

function validateField(field: keyof FormErrors, value: unknown): string {
  if (field === 'firstname' || field === 'lastname') {
    const v = String(value ?? '');
    if (!v) return field === 'firstname' ? 'First Name is Required. ' : 'Last Name is Required. ';
    let msg = '';
    const labelLong = field === 'firstname' ? 'First Name' : 'Last Name';
    if (v.length < 2) msg += `${labelLong} Length must be atleast 2 characters long `;
    if (v.length > 25) msg += `${labelLong} Length cannot be more than 25 characters long `;
    return msg;
  }
  if (field === 'telnum') {
    const s = String(value ?? '');
    if (!s) return 'Tel. number is Required. ';
    if (!/^\d+$/.test(s)) return 'Tel. number must contain only numbers. ';
    return '';
  }
  if (field === 'email') {
    const v = String(value ?? '');
    if (!v) return 'Email is Required. ';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email not in valid format. ';
    return '';
  }
  return '';
}

function isFormValid(form: FormState): boolean {
  return (
    form.firstname.length >= 2 &&
    form.firstname.length <= 25 &&
    form.lastname.length >= 2 &&
    form.lastname.length <= 25 &&
    /^\d+$/.test(String(form.telnum)) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  );
}

export function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [errMess, setErrMess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingResponse, setIsShowingResponse] = useState(false);

  const errors: FormErrors = {
    firstname: touched.firstname ? validateField('firstname', form.firstname) : '',
    lastname: touched.lastname ? validateField('lastname', form.lastname) : '',
    telnum: touched.telnum ? validateField('telnum', form.telnum) : '',
    email: touched.email ? validateField('email', form.email) : '',
  };
  const formValid = isFormValid(form);

  const reset = () => {
    setForm(initialForm);
    setTouched({});
    setFeedback(null);
    setErrMess(null);
    setIsLoading(false);
    setIsShowingResponse(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setIsLoading(true);
    const payload: Feedback = { ...form };
    putFeedback(payload)
      .then((fb) => setFeedback(fb))
      .catch((err) => {
        setFeedback(null);
        setErrMess(String((err as Error).message ?? err));
      })
      .finally(() => {
        setIsShowingResponse(true);
        setTimeout(() => {
          setIsShowingResponse(false);
          setIsLoading(false);
        }, 5000);
      });
    setForm(initialForm);
    setTouched({});
  };

  const openMap = () => {
    const url =
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('121, Clear Water Bay Road, Clear Water Bay, Kowloon, HONG KONG');
    window.open(url, '_blank');
  };
  const callPhone = () => window.open('tel:+85212345678', '_self');
  const sendEmail = () =>
    window.open(
      `mailto:info@restaurant.com?subject=${encodeURIComponent('Restaurant Inquiry')}&body=${encodeURIComponent(
        'Hello, I would like to inquire about...',
      )}`,
      '_self',
    );

  return (
    <div className="container contact-container">
      <div className="contact-hero hero-section">
        <div className="hero-badge">
          <i className="fa fa-envelope" /> <span>Contact Us</span>
        </div>
        <h1 className="hero-title">Let's Start a Conversation</h1>
        <p className="hero-subtitle">
          We're here to help and answer any questions you might have. We look forward to hearing from you.
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">&lt; 2h</span>
            <span className="stat-label">Response</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
        </div>
      </div>

      <section className="contact-info-section">
        <div className="section-header">
          <div className="section-badge">
            <i className="fa fa-info-circle" /> <span>Get In Touch</span>
          </div>
          <h2 className="section-title">Multiple Ways to Reach Us</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>
              <i className="fa fa-map-marker" /> Our Location
            </h3>
            <address>
              121, Clear Water Bay Road
              <br />
              Clear Water Bay, Kowloon
              <br />
              HONG KONG
            </address>
            <Button variant="outlined" color="primary" onClick={openMap} startIcon={<i className="fa fa-external-link" />}>
              View on Map
            </Button>
          </div>

          <div className="contact-card">
            <h3>
              <i className="fa fa-phone" /> Phone &amp; Email
            </h3>
            <div>
              <strong>Phone:</strong> +852 1234 5678{' '}
              <Button size="small" onClick={callPhone}>
                <i className="fa fa-phone" />
              </Button>
            </div>
            <div>
              <strong>Email:</strong> info@restaurant.com{' '}
              <Button size="small" onClick={sendEmail}>
                <i className="fa fa-envelope" />
              </Button>
            </div>
          </div>

          <div className="contact-card">
            <h3>
              <i className="fa fa-clock-o" /> Business Hours
            </h3>
            <div>Monday - Friday: 11:00 AM - 10:00 PM</div>
            <div>Saturday: 10:00 AM - 11:00 PM</div>
            <div>Sunday: 10:00 AM - 9:00 PM</div>
            <Button variant="outlined" component={Link} to="/menu" startIcon={<i className="fa fa-cutlery" />} sx={{ mt: 1 }}>
              View Menu
            </Button>
          </div>
        </div>
      </section>

      <section className="feedback-section" style={{ marginTop: 48 }}>
        <div className="section-header">
          <div className="section-badge">
            <i className="fa fa-comments" /> <span>Share Feedback</span>
          </div>
          <h2 className="section-title">We Value Your Opinion</h2>
          <p className="section-description">
            Help us improve by sharing your dining experience. Your feedback is invaluable to us.
          </p>
        </div>

        {!isLoading && !isShowingResponse && (
          <form className="feedback-form" onSubmit={handleSubmit} data-testid="feedback-form" noValidate>
            <div className="form-row">
              <TextField
                label="First Name"
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                onBlur={() => setTouched({ ...touched, firstname: true })}
                required
                fullWidth
                variant="outlined"
                error={Boolean(errors.firstname)}
                helperText={errors.firstname || ' '}
                slotProps={{ htmlInput: { 'aria-label': 'firstname' } }}
              />
              <TextField
                label="Last Name"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                onBlur={() => setTouched({ ...touched, lastname: true })}
                required
                fullWidth
                variant="outlined"
                error={Boolean(errors.lastname)}
                helperText={errors.lastname || ' '}
                slotProps={{ htmlInput: { 'aria-label': 'lastname' } }}
              />
            </div>
            <div className="form-row">
              <TextField
                label="Phone Number"
                value={form.telnum || ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm({ ...form, telnum: v === '' ? 0 : Number(v) });
                }}
                onBlur={() => setTouched({ ...touched, telnum: true })}
                required
                fullWidth
                type="tel"
                variant="outlined"
                error={Boolean(errors.telnum)}
                helperText={errors.telnum || ' '}
                slotProps={{ htmlInput: { 'aria-label': 'telnum', pattern: '[0-9]*' } }}
              />
              <TextField
                label="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => setTouched({ ...touched, email: true })}
                required
                fullWidth
                type="email"
                variant="outlined"
                error={Boolean(errors.email)}
                helperText={errors.email || ' '}
                slotProps={{ htmlInput: { 'aria-label': 'email' } }}
              />
            </div>

            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.agree}
                    onChange={(_, v) => setForm({ ...form, agree: v })}
                    slotProps={{ input: { 'aria-label': 'agree' } as React.InputHTMLAttributes<HTMLInputElement> }}
                  />
                }
                label="May we contact you for follow-up?"
              />
              {form.agree && (
                <TextField
                  select
                  label="Preferred Contact Method"
                  value={form.contacttype}
                  onChange={(e) => setForm({ ...form, contacttype: e.target.value })}
                  fullWidth
                  variant="outlined"
                  slotProps={{ htmlInput: { 'aria-label': 'contacttype' } }}
                  sx={{ mt: 1 }}
                >
                  {ContactType.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </div>

            <TextField
              label="Tell us about your experience"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              slotProps={{ htmlInput: { 'aria-label': 'message', maxLength: 500 } }}
              helperText={`${form.message.length}/500 characters`}
            />

            <div className="form-actions">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!formValid}
                startIcon={<i className="fa fa-paper-plane" />}
                data-testid="submit-feedback"
              >
                Send Feedback
              </Button>
              <p style={{ marginTop: 8, color: 'var(--charcoal-light)' }}>
                We'll review your feedback and get back to you within 24 hours
              </p>
            </div>
          </form>
        )}

        {isLoading && !isShowingResponse && (
          <div className="loading-section" data-testid="feedback-loading">
            <CircularProgress color="secondary" />
            <h3>Sending your feedback...</h3>
          </div>
        )}

        {isLoading && isShowingResponse && feedback && (
          <div className="contact-card" data-testid="feedback-response">
            <h3>
              <i className="fa fa-check-circle" style={{ color: 'green' }} /> Thank You!
            </h3>
            <p>
              Your feedback has been successfully submitted. We appreciate you taking the time to share your experience
              with us.
            </p>
            <div>
              <strong>Name:</strong> {feedback.firstname} {feedback.lastname}
            </div>
            <div>
              <strong>Phone:</strong> {feedback.telnum}
            </div>
            <div>
              <strong>Email:</strong> {feedback.email}
            </div>
            <div>
              <strong>Contact Permission:</strong> {feedback.agree ? 'Yes' : 'No'}
            </div>
            {feedback.agree && (
              <div>
                <strong>Contact Method:</strong> {feedback.contacttype}
              </div>
            )}
            <div>
              <strong>Feedback:</strong> {feedback.message}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Button variant="contained" color="primary" onClick={reset}>
                <i className="fa fa-plus" /> Send Another Feedback
              </Button>
              <Button variant="outlined" component={Link} to="/menu">
                <i className="fa fa-cutlery" /> View Our Menu
              </Button>
            </div>
          </div>
        )}

        {errMess && !isLoading && (
          <div className="error-section" data-testid="feedback-error">
            <i className="fa fa-exclamation-triangle error-icon" />
            <h3>Submission failed</h3>
            <p>{errMess}</p>
          </div>
        )}
      </section>
    </div>
  );
}
