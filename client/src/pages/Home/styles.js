import styled from 'styled-components';
import { motion } from 'framer-motion';

export const HomeWrap = styled.main`
  padding-bottom: 76px;
  overflow: hidden;
`;

export const HomeHero = styled(motion.section)`
  width: min(1440px, calc(100% - 40px));
  min-height: min(820px, calc(100vh - 76px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.72fr);
  gap: clamp(28px, 6vw, 84px);
  align-items: center;
  padding: clamp(58px, 9vw, 110px) 0 64px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
    padding-top: 42px;
    padding-bottom: 36px;
  }
`;

export const HeroCopy = styled.div`
  min-width: 0;

  > span {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 18px;
    padding: 10px 14px;
    border: 1px solid rgba(32, 208, 163, 0.28);
    border-radius: 999px;
    color: #9df8dc;
    background: rgba(32, 208, 163, 0.1);
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 1050px;
    margin: 0;
    color: #ffffff;
    font-size: clamp(44px, 7vw, 92px);
    line-height: 0.96;
    letter-spacing: -0.075em;
  }

  p {
    max-width: 760px;
    margin: 26px 0 0;
    color: rgba(231, 238, 251, 0.72);
    font-size: clamp(16px, 2vw, 21px);
    line-height: 1.75;
  }

  @media (max-width: 640px) {
    h1 {
      font-size: clamp(42px, 14vw, 64px);
      letter-spacing: -0.065em;
    }

    p {
      margin-top: 20px;
    }
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;

  .ant-btn {
    min-height: 48px;
    border-radius: 999px;
    font-weight: 900;
  }
`;

export const HeroMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 760px;
  margin-top: 34px;

  @media (max-width: 640px) {
    gap: 8px;
    margin-top: 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroMetric = styled.div`
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(18px);

  .anticon {
    color: #20d0a3;
    font-size: 20px;
  }

  strong {
    display: block;
    margin-top: 10px;
    color: #ffffff;
    font-size: 28px;
    letter-spacing: -0.04em;
  }

  span {
    color: rgba(231, 238, 251, 0.62);
    font-size: 13px;
    font-weight: 800;
  }

  @media (max-width: 640px) {
    padding: 12px;

    strong {
      margin-top: 6px;
      font-size: 23px;
    }

    span {
      font-size: 12px;
    }
  }
`;

export const HeroPreview = styled.div`
  position: relative;
  min-height: 520px;
  display: grid;
  align-content: center;

  @media (max-width: 980px) {
    min-height: 380px;
  }

  @media (max-width: 640px) {
    min-height: 280px;
  }
`;

export const HeroOrbit = styled.div`
  position: absolute;
  inset: 8% 2% 4% 8%;
  border: 1px solid rgba(32, 208, 163, 0.18);
  border-radius: 44px;
  background:
    radial-gradient(circle at 72% 18%, rgba(55, 169, 255, 0.28), transparent 24%),
    radial-gradient(circle at 18% 84%, rgba(32, 208, 163, 0.24), transparent 28%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.035));
  box-shadow: 0 34px 120px rgba(0, 0, 0, 0.26);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
  }

  &::before {
    width: 180px;
    height: 180px;
    top: 34px;
    right: 44px;
    border: 1px solid rgba(32, 208, 163, 0.32);
    animation: floatPulse 5s ease-in-out infinite;
  }

  &::after {
    width: 82px;
    height: 82px;
    left: 36px;
    bottom: 54px;
    background: rgba(32, 208, 163, 0.18);
    animation: floatPulse 4.2s ease-in-out infinite reverse;
  }

  @keyframes floatPulse {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.78; }
    50% { transform: translate3d(0, -14px, 0) scale(1.04); opacity: 1; }
  }
`;

export const VisualCard = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: min(100%, ${({ $compact }) => ($compact ? '360px' : '440px')});
  margin-left: ${({ $compact }) => ($compact ? 'auto' : '0')};
  margin-top: ${({ $compact }) => ($compact ? '-12px' : '0')};
  padding: ${({ $compact }) => ($compact ? '22px' : '30px')};
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: ${({ $compact }) => ($compact ? '28px' : '36px')};
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.07));
  backdrop-filter: blur(22px);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.26);

  span {
    color: #9df8dc;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h2 {
    margin: 14px 0 10px;
    color: #ffffff;
    font-size: ${({ $compact }) => ($compact ? '28px' : '38px')};
    line-height: 1.02;
    letter-spacing: -0.06em;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.68);
    line-height: 1.65;
  }

  div {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 18px;
    margin-top: 30px;
    padding: 18px;
    border-radius: 24px;
    background: rgba(6, 17, 31, 0.46);
  }

  small {
    color: rgba(231, 238, 251, 0.62);
    font-weight: 800;
  }

  strong {
    color: #20d0a3;
    font-size: 38px;
    letter-spacing: -0.06em;
  }

  @media (max-width: 640px) {
    width: min(100%, ${({ $compact }) => ($compact ? '300px' : '100%')});
    padding: ${({ $compact }) => ($compact ? '16px' : '20px')};
    border-radius: 26px;

    h2 {
      font-size: ${({ $compact }) => ($compact ? '23px' : '30px')};
    }

    div {
      margin-top: 18px;
      padding: 14px;
    }

    strong {
      font-size: 31px;
    }
  }
`;

export const FeatureCard = styled.div`
  display: block;
  height: 100%;
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(32, 208, 163, 0.42);
    background: rgba(32, 208, 163, 0.1);
  }

  > .anticon {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    margin-bottom: 18px;
    border-radius: 18px;
    color: #06111f;
    background: #20d0a3;
    font-size: 24px;
  }

  h3 {
    margin: 0 0 10px;
    color: #ffffff;
    font-size: 22px;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.68);
    line-height: 1.7;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const NearbyPanel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 22px;
  border: 1px solid rgba(32, 208, 163, 0.24);
  border-radius: 30px;
  background:
    radial-gradient(circle at top left, rgba(32, 208, 163, 0.2), transparent 34%),
    rgba(255, 255, 255, 0.08);

  strong {
    display: block;
    margin-bottom: 6px;
    color: #ffffff;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.7);
    line-height: 1.7;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;

    .ant-space {
      width: 100%;

      .ant-btn {
        width: 100%;
      }
    }
  }
`;

export const Section = styled.section`
  width: min(1440px, calc(100% - 40px));
  margin: 72px auto 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;

  > * {
    min-width: 0;
  }

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
    margin-top: 54px;
  }
`;

export const ContactCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 22px;
  align-items: center;
  padding: clamp(24px, 5vw, 42px);
  border: 1px solid rgba(32, 208, 163, 0.24);
  border-radius: 34px;
  background:
    radial-gradient(circle at 12% 0%, rgba(32, 208, 163, 0.2), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.055));
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.18);

  > div > span {
    color: #9df8dc;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  h2 {
    margin: 10px 0 10px;
    color: #ffffff;
    font-size: clamp(30px, 4vw, 52px);
    line-height: 1.02;
    letter-spacing: -0.055em;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.72);
    line-height: 1.7;
  }

  .ant-space {
    justify-content: flex-end;
  }

  .ant-btn {
    border-radius: 999px;
    font-weight: 900;
  }

  @media (max-width: 820px) {
    grid-template-columns: 1fr;

    .ant-space {
      justify-content: flex-start;
    }
  }
`;

export const ContentGrid = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.52fr);
  gap: 24px;
  align-items: start;

  > * {
    min-width: 0;
  }

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const ApartmentGrid = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;

  > * {
    min-width: 0;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const StickyMap = styled.aside`
  position: sticky;
  top: 96px;

  @media (max-width: 1120px) {
    position: static;
  }
`;
