import styled from 'styled-components';

export const MapCard = styled.div`
  min-width: 0;
  max-width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--border-soft);
  border-radius: 32px;
  background: var(--surface);
  box-shadow: 0 22px 70px var(--shadow-soft);

  .ant-alert {
    border-color: rgba(32, 208, 163, 0.32);
    background: rgba(238, 255, 233, 0.98);
  }

  .ant-alert-message {
    color: #082131 !important;
    font-size: 18px;
    font-weight: 900;
  }

  .ant-alert-description {
    color: #334155 !important;
    font-size: 15px;
    font-weight: 700;
  }

  .ant-alert-icon {
    color: #2fbf23 !important;
    font-size: 26px;
  }

  > * {
    min-width: 0;
  }

  @media (max-width: 640px) {
    padding: 14px;
    border-radius: 24px;
  }
`;

export const MapToolbar = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  span {
    display: block;
    color: var(--text-soft);
    font-size: 13px;
    font-weight: 700;
  }

  strong {
    color: var(--text-heading);
    font-size: 22px;
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;

    .ant-btn {
      width: 100%;
    }
  }
`;

export const MapFrame = styled.iframe`
  width: 100%;
  height: clamp(320px, 62vw, 460px);
  border: 0;
  border-radius: 28px;
  overflow: hidden;
  background: #0d1b2e;
`;

export const FallbackMap = styled.div`
  position: relative;
  height: clamp(320px, 62vw, 460px);
  border-radius: 28px;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    radial-gradient(circle at 55% 48%, rgba(32, 208, 163, 0.28), transparent 22%),
    linear-gradient(135deg, #0d1b2e, #07111f);
  background-size: 44px 44px, 44px 44px, auto, auto;

  &::after {
    content: 'Da Nang Map Preview';
    position: absolute;
    right: 24px;
    bottom: 22px;
    color: rgba(231, 238, 251, 0.28);
    font-size: clamp(26px, 5vw, 58px);
    font-weight: 900;
    letter-spacing: -0.06em;
  }
`;

export const MapPin = styled.button`
  position: absolute;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50% 50% 50% 8px;
  color: #06111f;
  background: #20d0a3;
  box-shadow: 0 16px 35px rgba(32, 208, 163, 0.36);
  rotate: -45deg;
  cursor: pointer;

  svg {
    rotate: 45deg;
  }
`;
