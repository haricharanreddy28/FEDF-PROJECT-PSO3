import React from 'react';
import Button from './Button';

const SafeExitButton: React.FC = () => {
  const handleSafeExit = () => {
    
    sessionStorage.clear();
    
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

