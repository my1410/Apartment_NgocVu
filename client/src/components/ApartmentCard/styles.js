import styled from 'styled-components';

export const Image = styled.img`
  width: 100%;
  height: 230px;
  object-fit: cover;
`;

export const CardBody = styled.div`
  display: grid;
  gap: 18px;

  .ant-tag {
    border-color: var(--border-soft);
    color: rgba(231, 238, 251, 0.82);
    background: var(--surface);
  }

  :root[data-theme='light'] &,
  :root[data-theme='light'] & .ant-tag {
    color: #020617;
    opacity: 1;
  }

  :root[data-theme='light'] & .ant-tag {
    border-color: rgba(2, 6, 23, 0.16);
    background: rgba(255, 255, 255, 0.92);
  }
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;

  button {
    margin: 0;
    padding: 0;
    border: 0;
    color: var(--text-heading);
    background: transparent;
    font-size: 20px;
    font-weight: 800;
    line-height: 1.25;
    text-align: left;
    cursor: pointer;

    &:hover {
      color: #9df8dc;
    }
  }

  p {
    margin: 8px 0 0;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-soft);
    line-height: 1.45;
  }

  strong {
    flex: 0 0 auto;
    color: #9df8dc;
    font-size: 19px;
  }

  :root[data-theme='light'] & button,
  :root[data-theme='light'] & p,
  :root[data-theme='light'] & strong {
    color: #020617;
    opacity: 1;
  }

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  span {
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    color: rgba(231, 238, 251, 0.78);
    background: rgba(255, 255, 255, 0.05);
    text-align: center;
    font-size: 13px;
    font-weight: 700;
  }

  :root[data-theme='light'] & span {
    color: #020617;
    border-color: rgba(2, 6, 23, 0.14);
    background: rgba(255, 255, 255, 0.9);
    opacity: 1;
  }

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const AvailabilityBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid ${({ $soldOut }) => ($soldOut ? 'rgba(248, 113, 113, 0.34)' : 'rgba(32, 208, 163, 0.28)')};
  border-radius: 18px;
  color: ${({ $soldOut }) => ($soldOut ? '#fecaca' : '#9df8dc')};
  background: ${({ $soldOut }) => ($soldOut ? 'rgba(248, 113, 113, 0.1)' : 'rgba(32, 208, 163, 0.1)')};
  font-weight: 900;

  span {
    color: var(--text-soft);
    font-size: 13px;
    font-weight: 800;
  }

  :root[data-theme='light'] &,
  :root[data-theme='light'] & span {
    color: #020617;
    opacity: 1;
  }
`;
