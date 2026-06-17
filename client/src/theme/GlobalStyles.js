import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    color: #e7eefb;
    background:
      radial-gradient(circle at top left, rgba(32, 208, 163, 0.2), transparent 30%),
      radial-gradient(circle at 80% 15%, rgba(55, 169, 255, 0.2), transparent 28%),
      linear-gradient(135deg, #06111f 0%, #0d1726 48%, #07111f 100%);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .ant-select-selector,
  .ant-input,
  .ant-input-number,
  .ant-slider-track {
    backdrop-filter: blur(18px);
  }

  .ant-card,
  .ant-drawer-content,
  .ant-modal-content {
    backdrop-filter: blur(18px);
  }
`;
