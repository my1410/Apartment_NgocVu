import styled from 'styled-components';

export const StatGrid = styled.div`
  width: min(1440px, calc(100% - 40px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: 760px) {
    width: min(100% - 24px, 1440px);
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.08);

  > .anticon {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    border-radius: 18px;
    color: #06111f;
    background: #20d0a3;
    font-size: 24px;
  }

  .ant-statistic-title {
    color: rgba(231, 238, 251, 0.62);
  }

  .ant-statistic-content {
    color: #ffffff;
    font-weight: 900;
  }
`;
