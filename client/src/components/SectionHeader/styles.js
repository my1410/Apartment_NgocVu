import styled from 'styled-components';

export const Wrap = styled.div`
  max-width: 760px;

  p {
    margin: 10px 0 0;
    color: rgba(231, 238, 251, 0.68);
    font-size: 16px;
    line-height: 1.7;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  margin-bottom: 12px;
  padding: 8px 12px;
  border: 1px solid rgba(32, 208, 163, 0.32);
  border-radius: 999px;
  color: #9df8dc;
  background: rgba(32, 208, 163, 0.1);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: clamp(30px, 4vw, 54px);
  line-height: 1.04;
  letter-spacing: -0.05em;
`;
