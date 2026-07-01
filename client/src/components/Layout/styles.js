import styled from 'styled-components';
import { Button } from 'antd';

export const PageShell = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border-soft);
  background: var(--header-bg);
  backdrop-filter: blur(22px);
`;

export const HeaderInner = styled.div`
  width: min(1440px, calc(100% - 40px));
  height: 76px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
    height: 68px;
  }
`;

export const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
  white-space: nowrap;
  color: var(--text-heading);

  span {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 14px;
    color: #06111f;
    background: linear-gradient(135deg, #20d0a3, #8cf7d7);
    box-shadow: 0 16px 40px rgba(32, 208, 163, 0.3);
  }

  @media (max-width: 420px) {
    gap: 8px;
    font-size: 15px;

    span {
      width: 36px;
      height: 36px;
      border-radius: 12px;
    }
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 18px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-main);
    font-weight: 700;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const PreferenceControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .ant-btn,
  .ant-select-selector {
    border-color: var(--border-soft) !important;
    background: var(--surface) !important;
  }

  .ant-select {
    min-width: 86px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const MobilePreferenceControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 4px;

  .ant-select-selector {
    min-height: 46px;
    border-radius: 999px !important;
    background: var(--surface) !important;
    border-color: var(--border-soft) !important;
  }
`;

export const MobileMenuButton = styled(Button)`
  display: none;

  @media (max-width: 900px) {
    display: inline-flex;
    align-items: center;
    font-weight: 800;
  }
`;

export const MobileDrawerContent = styled.nav`
  display: grid;
  gap: 12px;

  a {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 14px;
    border-radius: 16px;
    color: var(--text-main);
    font-weight: 800;
    background: var(--surface);
    border: 1px solid var(--border-soft);

    &:hover {
      color: var(--text-heading);
      background: rgba(32, 208, 163, 0.16);
      border-color: rgba(32, 208, 163, 0.32);
    }
  }

  a.active {
    color: #9df8dc;
    background: rgba(32, 208, 163, 0.2);
    border-color: rgba(32, 208, 163, 0.42);
  }

  .ant-btn a {
    min-height: auto;
    padding: 0;
    color: inherit;
    background: transparent;
  }
`;
