import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card from '../components/Card';
import Button from '../components/Button';
import SafeExitButton from '../components/SafeExitButton';
import LoadingSpinner from '../components/LoadingSpinner';
import './ContactCounsellorPage.css';

const contactSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
  urgency: yup.string().oneOf(['low', 'medium', 'high']).required('Urgency level is required'),
});

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

const ContactCounsellorPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="contact-counsellor-page">
      <SafeExitButton />
      <div className="contact-container">
        <div className="contact-hero">
          <h1>Contact a Counsellor</h1>
          <p>Reach out to trained professionals who are here to support you.</p>
        </div>

        <div className="contact-content">
          <Card className="contact-form-card">
            <h2>Send a Message</h2>
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>Your message has been sent successfully. A counsellor will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={errors.name ? 'input-error' : ''}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className="error-message">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'input-error' : ''}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="error-message">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="urgency">Urgency Level</label>
                  <select
                    id="urgency"
                    {...register('urgency')}
                    className={errors.urgency ? 'input-error' : ''}
                  >
                    <option value="">Select urgency level</option>
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Need support soon</option>
                    <option value="high">High - Urgent assistance needed</option>
                  </select>
                  {errors.urgency && <span className="error-message">{errors.urgency.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={8}
                    className={errors.message ? 'input-error' : ''}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && <span className="error-message">{errors.message.message}</span>}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Send Message'}
                </Button>
              </form>
            )}
          </Card>

          <Card className="counsellor-info">
            <h2>What to Expect</h2>
            <ul>
              <li>Confidential and safe communication</li>
              <li>Response within 24-48 hours</li>
              <li>Professional support and guidance</li>
              <li>Respectful and non-judgmental assistance</li>
            </ul>
            <div className="emergency-note">
              <strong>If this is an emergency, please call 100 (Police) or 1091 (Women Helpline) immediately.</strong>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactCounsellorPage;

