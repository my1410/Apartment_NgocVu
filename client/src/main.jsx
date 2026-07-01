import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppPreferencesProvider } from './context/AppPreferences.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppPreferencesProvider>
      <App />
    </AppPreferencesProvider>
  </React.StrictMode>
);
