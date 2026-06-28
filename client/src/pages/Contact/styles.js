import styled from 'styled-components';

export const ContactPageWrap = styled.main`
  width: min(1180px, calc(100% - 40px));
  margin: 42px auto 90px;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(340px, 0.62fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    width: min(100% - 24px, 1180px);
    grid-template-columns: 1fr;
  }
`;

export const ContactHero = styled.section`
  padding: 34px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  background:
    radial-gradient(circle at top right, rgba(32, 208, 163, 0.18), transparent 32%),
    rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);

  span {
    color: #9df8dc;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 10px 0 16px;
    color: #ffffff;
    font-size: clamp(40px, 7vw, 74px);
    line-height: 0.98;
    letter-spacing: -0.07em;
  }

  p {
    color: rgba(231, 238, 251, 0.72);
    font-size: 17px;
    line-height: 1.75;
  }
`;

export const ContactCard = styled.section`
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);

  h2 {
    margin: 0 0 18px;
    color: #ffffff;
  }

  .ant-form-item-label > label {
    color: rgba(231, 238, 251, 0.76);
    font-weight: 800;
  }
`;

export const ContactInfoGrid = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 24px;

  div {
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 22px;
    background: rgba(3, 12, 24, 0.36);
  }

  strong {
    display: block;
    color: #ffffff;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.66);
  }
`;
