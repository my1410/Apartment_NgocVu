import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { getAppTheme } from '../theme/appTheme.js';
import { GlobalStyles } from '../theme/GlobalStyles.js';
import { translations } from '../i18n/translations.js';

const PreferencesContext = createContext(null);

function getStoredValue(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) || fallback;
}

export function AppPreferencesProvider({ children }) {
  const [language, setLanguageState] = useState(() => getStoredValue('language', 'vi'));
  const [themeMode, setThemeModeState] = useState(() => getStoredValue('themeMode', 'dark'));

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem('language', language);
    window.localStorage.setItem('themeMode', themeMode);
  }, [language, themeMode]);

  const t = useCallback((key, params = {}) => {
    const dictionary = translations[language] || translations.vi;
    const template = dictionary[key] || translations.vi[key] || key;
    return Object.entries(params).reduce(
      (text, [name, replacement]) => text.replaceAll(`{${name}}`, replacement),
      template
    );
  }, [language]);

  const value = useMemo(() => {
    return {
      language,
      setLanguage: setLanguageState,
      themeMode,
      setThemeMode: setThemeModeState,
      toggleTheme: () => setThemeModeState((current) => (current === 'dark' ? 'light' : 'dark')),
      t
    };
  }, [language, themeMode, t]);

  return (
    <PreferencesContext.Provider value={value}>
      <ConfigProvider locale={language === 'vi' ? viVN : enUS} theme={getAppTheme(themeMode)}>
        <AntdApp>
          <GlobalStyles $themeMode={themeMode} />
          {children}
        </AntdApp>
      </ConfigProvider>
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used inside AppPreferencesProvider');
  }
  return context;
}
