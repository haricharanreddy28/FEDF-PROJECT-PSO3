import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearSessionData } from '../utils/storage';
import { logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';

import SafeExitButton from './SafeExitButton';

import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleHideActivity = () => {
    clearSessionData();
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="layout">
      <SafeExitButton />
      <header className="layout-header">
        <div className="header-content">
          <h1 className="header-title">{t(title) || title}</h1>
          <div className="header-actions">
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              style={{ padding: '5px', borderRadius: '4px', marginRight: '10px' }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
            </select>
            <button className="theme-toggle" onClick={toggleTheme} title={t('theme')}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {user && (
              <div className="user-menu">
                <span className="user-name">{user.name}</span>
                <div className="user-menu-dropdown">
                  <button onClick={handleHideActivity} className="menu-item">
                    🫥 {t('hide_activity')}
                  </button>
                  <button onClick={handleLogout} className="menu-item">
                    {t('logout')}
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

