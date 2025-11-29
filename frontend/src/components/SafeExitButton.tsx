import React from 'react';
import Button from './Button';
import './SafeExitButton.css';

const SafeExitButton: React.FC = () => {
  const handleSafeExit = () => {
    // Clear session data
    sessionStorage.clear();
    // Redirect to Google
    window.location.href = 'https://www.google.com';
  };

  return (
    <Button
      variant="danger"
      onClick={handleSafeExit}
      className="safe-exit-btn"
    >
      🚪 Safe Exit
    </Button>
  );
};

export default SafeExitButton;

