import styled from 'styled-components';

export const AccountPageWrap = styled.main`
  width: min(1180px, calc(100% - 40px));
  margin: 42px auto 90px;
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(340px, 0.42fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 920px) {
    width: min(100% - 24px, 1180px);
    grid-template-columns: 1fr;
  }
`;

export const AccountPanel = styled.section`
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.2);

  span {
    color: #9df8dc;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2 {
    margin: 8px 0 16px;
    color: #ffffff;
  }

  h1 {
    font-size: clamp(34px, 5vw, 58px);
    letter-spacing: -0.06em;
  }

  p {
    color: rgba(231, 238, 251, 0.68);
    line-height: 1.7;
  }

  .ant-form-item-label > label {
    color: rgba(231, 238, 251, 0.76);
    font-weight: 800;
  }
`;

export const AccountActionGrid = styled.div`
  display: grid;
  gap: 14px;

  a,
  button {
    width: 100%;
  }
`;

export const AccountSideStack = styled.div`
  display: grid;
  gap: 24px;
`;

export const SecurityList = styled.div`
  display: grid;
  gap: 12px;
  margin: 18px 0 22px;
`;

export const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(3, 12, 24, 0.28);

  strong {
    display: block;
    color: #ffffff;
  }

  small {
    color: rgba(231, 238, 251, 0.58);
  }
`;
