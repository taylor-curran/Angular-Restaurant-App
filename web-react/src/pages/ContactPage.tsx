import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { feedbackService } from '../api/services';
import type { Feedback } from '../api/types';

type FeedbackFormValues = {
  firstname: string;
  lastname: string;
  telnum: string;
  email: string;
  agree: boolean;
  contacttype: string;
  message: string;
};

const initialValues: FeedbackFormValues = {
  firstname: '',
  lastname: '',
  telnum: '0',
  email: '',
  agree: false,
  contacttype: 'None',
  message: '',
};

const contactTypes = ['None', 'Tel', 'Email'];

const validationMessages = {
  firstname: {
    required: 'First Name is Required.',
    minLength: 'First Name Length must be atleast 2 characters long',
    maxLength: 'First Name Length cannot be more than 25 characters long',
  },
  lastname: {
    required: 'Last Name is Required.',
    minLength: 'Last Name Length must be atleast 2 characters long',
    maxLength: 'Last Name Length cannot be more than 25 characters long',
  },
  telnum: {
    required: 'Tel. number is Required.',
    pattern: 'Tel. number must contain only numbers.',
  },
  email: {
    required: 'Email is Required.',
    pattern: 'Email not in valid format.',
  },
};

function errorForField(name: keyof typeof validationMessages, type?: string): string {
  if (!type) {
    return '';
  }
  const entries = validationMessages[name] as Record<string, string>;
  return entries[type] ?? '';
}

export function ContactPage() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingResponse, setIsShowingResponse] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FeedbackFormValues>({
    mode: 'onChange',
    defaultValues: initialValues,
  });

  const agree = watch('agree');
  const message = watch('message');

  const onSubmit = async (values: FeedbackFormValues) => {
    setIsLoading(true);
    setIsShowingResponse(false);
    try {
      const payload: Feedback = {
        ...values,
        telnum: Number(values.telnum),
      };
      const response = await feedbackService.postFeedback(payload);
      setFeedback(response);
      setIsShowingResponse(true);
      reset(initialValues);
    } catch (_error) {
      setFeedback(null);
      setIsShowingResponse(true);
      reset(initialValues);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa fa-envelope"></i>
            <span>Contact Us</span>
          </div>
          <h1 className="hero-title">Let&apos;s Start a Conversation</h1>
          <p className="hero-subtitle">
            We&apos;re here to help and answer any questions you might have. We look forward to hearing from you.
          </p>
        </div>
      </div>

      <div className="contact-content">
        <div className="feedback-section">
          <div className="section-header">
            <div className="section-badge">
              <i className="fa fa-comments"></i>
              <span>Share Feedback</span>
            </div>
            <h2 className="section-title">We Value Your Opinion</h2>
          </div>

          {!isLoading && !isShowingResponse && (
            <form className="feedback-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-row">
                <label className="field">
                  <span>First Name</span>
                  <input
                    type="text"
                    {...register('firstname', { required: true, minLength: 2, maxLength: 25 })}
                  />
                  <em>{errorForField('firstname', errors.firstname?.type)}</em>
                </label>
                <label className="field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    {...register('lastname', { required: true, minLength: 2, maxLength: 25 })}
                  />
                  <em>{errorForField('lastname', errors.lastname?.type)}</em>
                </label>
              </div>

              <div className="form-row">
                <label className="field">
                  <span>Phone Number</span>
                  <input type="tel" {...register('telnum', { required: true, pattern: /^[0-9]+$/ })} />
                  <em>{errorForField('telnum', errors.telnum?.type)}</em>
                </label>
                <label className="field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    {...register('email', {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    })}
                  />
                  <em>{errorForField('email', errors.email?.type)}</em>
                </label>
              </div>

              <div className="form-row">
                <label className="checkbox">
                  <input type="checkbox" {...register('agree')} />
                  <span>May we contact you for follow-up?</span>
                </label>
                {agree && (
                  <label className="field">
                    <span>Preferred Contact Method</span>
                    <select {...register('contacttype')}>
                      {contactTypes.map((contactType) => (
                        <option key={contactType} value={contactType}>
                          {contactType}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>

              <label className="field">
                <span>Your Feedback</span>
                <textarea rows={5} {...register('message', { maxLength: 500 })}></textarea>
                <small>{message?.length ?? 0}/500 characters</small>
              </label>

              <div className="form-actions">
                <button type="submit" className="action-btn primary-btn" disabled={!isValid}>
                  Send Feedback
                </button>
              </div>
            </form>
          )}

          {isLoading && !isShowingResponse && (
            <div className="loading-container">
              <div className="loading-content">
                <h3>Sending your feedback...</h3>
              </div>
            </div>
          )}

          {!isLoading && isShowingResponse && feedback && (
            <div className="response-container">
              <div className="response-content">
                <div className="response-header">
                  <h3>Thank You!</h3>
                  <p>Your feedback has been successfully submitted.</p>
                </div>
                <div className="response-details">
                  <div className="response-grid">
                    <div className="response-item">
                      <span className="label">Name</span>
                      <span className="value">
                        {feedback.firstname} {feedback.lastname}
                      </span>
                    </div>
                    <div className="response-item">
                      <span className="label">Phone</span>
                      <span className="value">{feedback.telnum}</span>
                    </div>
                    <div className="response-item">
                      <span className="label">Email</span>
                      <span className="value">{feedback.email}</span>
                    </div>
                    <div className="response-item full-width">
                      <span className="label">Feedback</span>
                      <span className="value">{feedback.message}</span>
                    </div>
                  </div>
                </div>
                <div className="response-actions">
                  <button
                    type="button"
                    className="action-btn secondary-btn"
                    onClick={() => {
                      setIsLoading(false);
                      setIsShowingResponse(false);
                      setFeedback(null);
                    }}
                  >
                    Send Another Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
