import styled from 'styled-components';

export const HomeWrap = styled.main`
  padding-bottom: 80px;
`;

export const HomeHero = styled.section`
  width: min(1440px, calc(100% - 40px));
  min-height: calc(100vh - 76px);
  margin: 0 auto;
  display: grid;
  align-content: center;
  padding: 72px 0;

  > span {
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
    font-size: clamp(48px, 8vw, 102px);
    line-height: 0.94;
    letter-spacing: -0.08em;
  }

  p {
    max-width: 760px;
    margin: 26px 0 0;
    color: rgba(231, 238, 251, 0.72);
    font-size: clamp(16px, 2vw, 21px);
    line-height: 1.75;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
`;

export const FeatureCard = styled.div`
  height: 100%;
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);

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

export const Section = styled.section`
  width: min(1440px, calc(100% - 40px));
  margin: 86px auto 0;
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
