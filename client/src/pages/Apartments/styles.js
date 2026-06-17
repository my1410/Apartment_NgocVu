import styled from 'styled-components';

export const PageHero = styled.section`
  width: min(1440px, calc(100% - 40px));
  margin: 0 auto;
  padding: 70px 0 16px;

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
  }
`;

export const AiPanel = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 1px solid rgba(32, 208, 163, 0.26);
  border-radius: 24px;
  background: rgba(32, 208, 163, 0.1);

  > .anticon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    color: #06111f;
    background: #20d0a3;
    font-size: 22px;
  }

  strong {
    display: block;
    color: #ffffff;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.72);
    line-height: 1.6;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;

    .ant-btn {
      width: 100%;
    }
  }
`;
