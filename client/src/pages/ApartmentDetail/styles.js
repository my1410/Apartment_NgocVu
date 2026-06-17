import styled from 'styled-components';

export const DetailPage = styled.main`
  width: min(1440px, calc(100% - 40px));
  margin: 42px auto 90px;
  display: grid;
  gap: 24px;

  > * {
    min-width: 0;
  }

  > .ant-btn {
    justify-self: start;
    max-width: 100%;
    white-space: normal;
  }

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
    margin-top: 24px;
  }
`;

export const DetailHero = styled.section`
  min-width: 0;
  min-height: 520px;
  display: flex;
  align-items: end;
  padding: 34px;
  border-radius: 36px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(6, 17, 31, 0.1), rgba(6, 17, 31, 0.88)),
    url(${({ $image }) => $image}) center/cover;

  h1 {
    max-width: 920px;
    margin: 16px 0 12px;
    color: #ffffff;
    font-size: clamp(36px, 6vw, 72px);
    line-height: 1;
    letter-spacing: -0.06em;
  }

  p {
    color: rgba(231, 238, 251, 0.78);
    font-size: 18px;
  }

  @media (max-width: 640px) {
    min-height: 420px;
    padding: 22px;
    border-radius: 28px;
  }
`;

export const DetailGrid = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.65fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const GlassPanel = styled.section`
  min-width: 0;
  display: grid;
  gap: 22px;
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.08);

  h2 {
    margin: 0;
    color: #ffffff;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.86);
    line-height: 1.75;
  }

  .ant-descriptions-view,
  .ant-descriptions-item-label,
  .ant-descriptions-item-content {
    border-color: rgba(255, 255, 255, 0.12) !important;
  }

  .ant-descriptions-item-label {
    color: rgba(231, 238, 251, 0.78) !important;
    background: rgba(255, 255, 255, 0.06) !important;
    font-weight: 800;
  }

  .ant-descriptions-item-content {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.03) !important;
  }

  @media (max-width: 640px) {
    padding: 18px;
    border-radius: 24px;
  }
`;

export const GalleryShell = styled.div`
  min-width: 0;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);

  .ant-carousel .slick-dots {
    bottom: 22px;
  }

  .ant-carousel .slick-dots li button {
    height: 5px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.82);
  }
`;

export const GallerySlide = styled.div`
  position: relative;
  min-width: 0;
  min-height: clamp(320px, 58vw, 720px);
  overflow: hidden;

  .ant-image,
  img {
    width: 100%;
    height: clamp(320px, 58vw, 720px);
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(6, 17, 31, 0.06), rgba(6, 17, 31, 0.18) 40%, rgba(6, 17, 31, 0.84)),
      radial-gradient(circle at 18% 78%, rgba(32, 208, 163, 0.22), transparent 34%);
    pointer-events: none;
  }

  > div:last-child {
    position: absolute;
    left: clamp(22px, 4vw, 52px);
    right: clamp(22px, 4vw, 52px);
    bottom: clamp(32px, 5vw, 64px);
    z-index: 2;
    max-width: 760px;
    animation: slideCaption 0.7s ease both;
  }

  span {
    display: inline-flex;
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: 999px;
    color: #06111f;
    background: #9df8dc;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
  }

  strong {
    display: block;
    color: #ffffff;
    font-size: clamp(30px, 5vw, 64px);
    line-height: 1;
    letter-spacing: -0.06em;
  }

  p {
    max-width: 620px;
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.86);
    font-size: clamp(15px, 2vw, 19px);
  }

  @keyframes slideCaption {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;

  .ant-image,
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 18px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
