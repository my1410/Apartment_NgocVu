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
    border-color: rgba(255, 255, 255, 0.12);
    color: rgba(231, 238, 251, 0.82);
    background: rgba(255, 255, 255, 0.08);
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
    color: #ffffff;
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
    color: rgba(231, 238, 251, 0.62);
    line-height: 1.45;
  }

  strong {
    flex: 0 0 auto;
    color: #9df8dc;
    font-size: 19px;
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

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
