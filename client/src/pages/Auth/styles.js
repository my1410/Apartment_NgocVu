import styled from 'styled-components';

export const LoginPageWrap = styled.main`
  min-height: calc(100vh - 76px);
  display: grid;
  place-items: center;
  padding: 40px 20px;
`;

export const LoginCard = styled.section`
  width: min(460px, 100%);
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 80px rgba(0, 0, 0, 0.24);

  span {
    color: #9df8dc;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 12px;
  }

  h1 {
    margin: 10px 0;
    color: #ffffff;
    font-size: 36px;
    letter-spacing: -0.05em;
  }

  p {
    margin: 0 0 24px;
    color: rgba(231, 238, 251, 0.68);
    line-height: 1.7;
  }
`;
