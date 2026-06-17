import styled from 'styled-components';

export const AdminPage = styled.main`
  width: min(1440px, calc(100% - 40px));
  margin: 42px auto 90px;
  color: #e7eefb;

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
  }
`;

export const AdminHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 26px;
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.08);

  span {
    color: #9df8dc;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 8px 0;
    color: #ffffff;
    font-size: clamp(34px, 5vw, 58px);
    line-height: 1;
    letter-spacing: -0.06em;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.68);
  }

  @media (max-width: 780px) {
    flex-direction: column;
  }
`;

export const FormPanel = styled.section`
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);

  h2 {
    margin: 0 0 18px;
    color: #ffffff;
  }

  .ant-input-number,
  .ant-select {
    width: 100%;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;

  strong {
    color: #20d0a3;
    font-size: 30px;
  }

  span {
    color: rgba(231, 238, 251, 0.66);
  }
`;
