import styled from 'styled-components';

export const HeroGrid = styled.section`
  width: min(1440px, calc(100% - 40px));
  min-height: calc(100vh - 76px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  align-items: center;
  gap: 44px;
  padding: 70px 0 54px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 46px;
  }

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
  }
`;

export const HeroText = styled.div`
  h1 {
    max-width: 920px;
    margin: 0;
    color: #ffffff;
    font-size: clamp(44px, 7vw, 92px);
    line-height: 0.94;
    letter-spacing: -0.07em;
  }

  p {
    max-width: 720px;
    margin: 24px 0 0;
    color: rgba(231, 238, 251, 0.72);
    font-size: clamp(16px, 2vw, 20px);
    line-height: 1.7;
  }
`;

export const TrustPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  color: #9df8dc;
  background: rgba(255, 255, 255, 0.08);
  font-weight: 800;
`;

export const SearchBar = styled.div`
  margin-top: 34px;
  display: grid;
  grid-template-columns: minmax(260px, 520px) auto;
  gap: 12px;

  .ant-cascader {
    width: 100%;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroPanel = styled.div`
  position: relative;
  display: grid;
  gap: 18px;
  min-height: 500px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 38px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06)),
    url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80') center/cover;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.38);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(6, 17, 31, 0.1), rgba(6, 17, 31, 0.72));
  }

  div {
    position: relative;
    align-self: end;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 24px;
    background: rgba(6, 17, 31, 0.62);
    backdrop-filter: blur(18px);
  }

  span {
    color: rgba(231, 238, 251, 0.68);
  }

  strong {
    color: #ffffff;
    font-size: 22px;
  }

  @media (max-width: 960px) {
    min-height: 360px;
  }
`;
