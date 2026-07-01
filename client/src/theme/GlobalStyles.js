import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  :root {
    --color-primary: #20d0a3;
    --color-info: #37a9ff;
    --page-bg:
      radial-gradient(circle at top left, rgba(32, 208, 163, 0.2), transparent 30%),
      radial-gradient(circle at 80% 15%, rgba(55, 169, 255, 0.2), transparent 28%),
      linear-gradient(135deg, #06111f 0%, #0d1726 48%, #07111f 100%);
    --text-main: #e7eefb;
    --text-heading: #ffffff;
    --text-muted: rgba(231, 238, 251, 0.7);
    --text-soft: rgba(231, 238, 251, 0.58);
    --surface: rgba(255, 255, 255, 0.08);
    --surface-strong: rgba(255, 255, 255, 0.14);
    --surface-solid: rgba(6, 17, 31, 0.92);
    --border-soft: rgba(255, 255, 255, 0.12);
    --header-bg: rgba(6, 17, 31, 0.78);
    --shadow-soft: rgba(0, 0, 0, 0.22);
    --inverse-text: #06111f;
  }

  :root[data-theme='light'] {
    --page-bg:
      radial-gradient(circle at top left, rgba(32, 208, 163, 0.16), transparent 30%),
      radial-gradient(circle at 80% 12%, rgba(55, 169, 255, 0.15), transparent 28%),
      linear-gradient(135deg, #f6fbff 0%, #eef7f6 48%, #f8fbff 100%);
    --text-main: #102033;
    --text-heading: #07111f;
    --text-muted: rgba(15, 23, 42, 0.68);
    --text-soft: rgba(15, 23, 42, 0.52);
    --surface: rgba(255, 255, 255, 0.74);
    --surface-strong: rgba(255, 255, 255, 0.9);
    --surface-solid: rgba(255, 255, 255, 0.96);
    --border-soft: rgba(15, 23, 42, 0.12);
    --header-bg: rgba(255, 255, 255, 0.78);
    --shadow-soft: rgba(15, 23, 42, 0.12);
    --inverse-text: #06111f;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    color: var(--text-main);
    background: var(--page-bg);
    transition: background 0.25s ease, color 0.25s ease;
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

  .ant-drawer-content,
  .ant-modal-content {
    background: var(--surface-solid) !important;
  }

  .ant-drawer-title,
  .ant-modal-title,
  .ant-form-item-label > label,
  .ant-statistic-title {
    color: var(--text-main) !important;
  }

  .ant-empty-description {
    color: var(--text-muted) !important;
  }

  :root[data-theme='light'] .ant-btn-default {
    color: #102033;
    border-color: rgba(15, 23, 42, 0.14);
    background: rgba(255, 255, 255, 0.74);
  }
`;
