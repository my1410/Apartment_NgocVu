import styled from 'styled-components';

export const FilterCard = styled.div`
  min-width: 0;
  max-width: 100%;
  padding: 24px;
  border: 1px solid var(--border-soft);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.16);

  .ant-select,
  .ant-input-number {
    width: 100%;
  }

  .ant-row,
  .ant-col {
    min-width: 0;
  }

  label {
    display: block;
    margin-bottom: 10px;
    color: var(--text-muted);
    font-weight: 700;
  }

  .ant-checkbox-wrapper {
    min-height: 44px;
    display: flex;
    align-items: center;
    color: rgba(231, 238, 251, 0.78);
    font-weight: 800;
  }

  @media (max-width: 640px) {
    padding: 18px;
    border-radius: 24px;
  }
`;

export const FilterTitle = styled.div`
  min-width: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  span {
    color: #9df8dc;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h3 {
    margin: 4px 0 0;
    color: var(--text-heading);
    font-size: clamp(20px, 2vw, 26px);
  }

  @media (max-width: 640px) {
    flex-direction: column;

    .ant-btn {
      width: 100%;
    }
  }
`;
