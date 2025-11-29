import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearSessionData } from '../utils/storage';
import { logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';
import SafeExitButton from './SafeExitButton';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleHideActivity = () => {
    clearSessionData();
    navigate('/');
  };

  return (
    <div className="layout">
      <SafeExitButton />
      <header className="layout-header">
        <div className="header-content">
          <h1 className="header-title">{title}</h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {user && (
              <div className="user-menu">
                <span className="user-name">{user.name}</span>
                <div className="user-menu-dropdown">
                  <button onClick={handleHideActivity} className="menu-item">
                    🫥 Hide My Activity
                  </button>
                  <button onClick={handleLogout} className="menu-item">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;

