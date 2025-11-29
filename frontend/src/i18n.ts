import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "app_title": "SafeSpace",
            "welcome": "Welcome",
            "login": "Login",
            "logout": "Logout",
            "register": "Register",
            "hide_activity": "Hide My Activity",
            "dashboard": "Dashboard",
            "connect": "Connect",
            "language": "Language",
            "theme": "Theme",
            "safe_exit": "Safe Exit",
            "emergency_help": "Emergency Help",
            "legal_rights": "Legal Rights",
            "counselling": "Counselling",
            "support_services": "Support Services"
        }
    },
    hi: {
        translation: {
            "app_title": "सुरक्षित स्थान",
            "welcome": "स्वागत है",
            "login": "लॉग इन करें",
            "logout": "लॉग आउट",
            "register": "पंजीकरण करें",
            "hide_activity": "मेरी गतिविधि छिपाएं",
            "dashboard": "डैशबोर्ड",
            "connect": "जुड़ें",
            "language": "भाषा",
            "theme": "थीम",
            "safe_exit": "सुरक्षित निकास",
            "emergency_help": "आपातकालीन सहायता",
            "legal_rights": "कानूनी अधिकार",
            "counselling": "परामर्श",
            "support_services": "सहायता सेवाएं"
        }
    },
    te: {
        translation: {
            "app_title": "సురక్షిత ప్రదేశం",
            "welcome": "స్వాగతం",
            "login": "లాగిన్",
            "logout": "లాగౌట్",
            "register": "నమోదు",
            "hide_activity": "నా కార్యాచరణను దాచండి",
            "dashboard": "డాష్‌బోర్డ్",
            "connect": "కనెక్ట్ చేయండి",
            "language": "భాష",
            "theme": "థీమ్",
            "safe_exit": "సురక్షిత నిష్క్రమణ",
            "emergency_help": "అత్యవసర సహాయం",
            "legal_rights": "చట్టపరమైన హక్కులు",
            "counselling": "కౌన్సెలింగ్",
            "support_services": "మద్దతు సేవలు"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
