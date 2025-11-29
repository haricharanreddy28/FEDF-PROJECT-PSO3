import React from 'react';

const SafeSpaceLogo: React.FC = () => {
  return (
    <div className="safe-space-logo">
      <svg
        viewBox="0 0 200 200"
        className="logo-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="4"
          className="logo-circle-outer"
        />
        
        <circle
          cx="100"
          cy="100"
          r="65"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="3"
          className="logo-circle-middle"
        />
        
        <circle
          cx="100"
          cy="100"
          r="45"
          fill="url(#gradient3)"
          opacity="0.2"
          className="logo-circle-inner"
        />
        
        <path
          d="M100,140 C100,140 75,115 75,95 C75,82 85,72 100,72 C115,72 125,82 125,95 C125,115 100,140 100,140 Z"
          fill="url(#gradient4)"
          className="logo-heart"
        />
        
        <path
          d="M100,60 L120,70 L120,100 Q120,115 100,125 Q80,115 80,100 L80,70 Z"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2.5"
          opacity="0.6"
          className="logo-shield"
        />
        
        <g className="logo-stars">
          <circle cx="45" cy="45" r="3" fill="#4ECDC4" opacity="0.9" />
          <circle cx="155" cy="45" r="3" fill="#9B7EDE" opacity="0.9" />
          <circle cx="45" cy="155" r="3" fill="#9B7EDE" opacity="0.9" />
          <circle cx="155" cy="155" r="3" fill="#4ECDC4" opacity="0.9" />
        </g>
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B7EDE" />
            <stop offset="100%" stopColor="#4ECDC4" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8A5E0" />
            <stop offset="100%" stopColor="#7EDDD6" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B7EDE" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B7EDE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SafeSpaceLogo;

