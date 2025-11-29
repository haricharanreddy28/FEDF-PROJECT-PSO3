import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import SafeExitButton from '../components/SafeExitButton';
import Card from '../components/Card';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      id: 1,
      text: "This platform gave me the courage to seek help. The support I received was life-changing.",
      author: "Anonymous Survivor"
    },
    {
      id: 2,
      text: "I found the legal information I needed and connected with an amazing counselor. Thank you.",
      author: "Anonymous Survivor"
    },
    {
      id: 3,
      text: "The safe exit feature and privacy options made me feel secure while accessing resources.",
      author: "Anonymous Survivor"
    }
  ];

  return (
    <div className="landing-page">
      <SafeExitButton />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">You Are Not Alone. We Are Here to Help.</h1>
          <p className="hero-subtitle">
            A safe space for support, resources, and guidance on your journey to safety and healing.
          </p>
          <div className="hero-buttons">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/emergency')}
            >
              🆘 Emergency Help
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => navigate('/rights')}
            >
              📖 Know Your Rights
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={() => navigate('/contact-counsellor')}
            >
              💬 Contact Counsellor
            </Button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-title-large">
            <h1 className="safe-space-text">SAFE SPACE</h1>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access-section">
        <h2 className="section-title">Quick Access</h2>
        <div className="quick-access-grid">
          <Card hoverable onClick={() => navigate('/emergency')}>
            <div className="quick-access-item">
              <div className="icon">🆘</div>
              <h3>Emergency Help</h3>
              <p>24/7 crisis support and emergency resources</p>
            </div>
          </Card>
          <Card hoverable onClick={() => navigate('/rights')}>
            <div className="quick-access-item">
              <div className="icon">📖</div>
              <h3>Know Your Rights</h3>
              <p>Legal information and your rights explained</p>
            </div>
          </Card>
          <Card hoverable onClick={() => navigate('/contact-counsellor')}>
            <div className="quick-access-item">
              <div className="icon">💬</div>
              <h3>Contact Counsellor</h3>
              <p>Connect with trained professionals</p>
            </div>
          </Card>
          <Card hoverable onClick={() => navigate('/support-services')}>
            <div className="quick-access-item">
              <div className="icon">🏥</div>
              <h3>Support Services</h3>
              <p>Find local support and resources</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Stories of Hope</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">— {testimonial.author}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Login/Register Section */}
      <section className="auth-section">
        <div className="auth-content">
          <h2>Get Started</h2>
          <p>Create an account or login to access personalized support</p>
          <div className="auth-buttons">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

