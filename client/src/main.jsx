import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import App from './App.jsx';
import { appTheme } from './theme/appTheme.js';
import { GlobalStyles } from './theme/GlobalStyles.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={viVN} theme={appTheme}>
      <AntdApp>
        <GlobalStyles />
        <App />
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);
