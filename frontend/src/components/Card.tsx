import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false, title }) => {
  return (
    <div
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {title && <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.25rem', color: 'var(--primary-purple)' }}>{title}</h2>}
      {children}
    </div>
  );
};

export default Card;

