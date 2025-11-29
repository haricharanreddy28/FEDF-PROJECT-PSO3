import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Card className="not-found-card">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>We're sorry, but the page you're looking for doesn't exist.</p>
          <p className="safe-message">You are safe. This is just a navigation error.</p>
          <div className="not-found-actions">
            <Button variant="primary" onClick={() => navigate('/')}>
              Go to Home
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;

