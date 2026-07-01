import styled from 'styled-components';
import { Card } from 'antd';

export const AdminPage = styled.main`
  width: min(1440px, calc(100% - 40px));
  margin: 42px auto 90px;
  color: #e7eefb;
  display: grid;
  gap: 24px;

  @media (max-width: 640px) {
    width: min(100% - 24px, 1440px);
    margin-top: 24px;
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

export const KpiGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  .ant-card {
    border-color: rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05)),
      rgba(9, 20, 34, 0.72);
    box-shadow: 0 22px 70px rgba(0, 0, 0, 0.18);
  }

  .ant-statistic-title {
    color: rgba(231, 238, 251, 0.62);
    font-weight: 800;
  }

  .ant-statistic-content {
    color: #ffffff;
    font-weight: 900;
  }

  .ant-statistic-content-prefix {
    color: #20d0a3;
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ManagementGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(340px, 0.42fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;

  > * {
    min-width: 0;
  }

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

export const FormPanel = styled.section`
  position: sticky;
  top: 96px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(32, 208, 163, 0.12), transparent 28%),
    rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);

  h2 {
    margin: 0 0 18px;
    color: #ffffff;
  }

  .ant-form-item-label > label,
  .ant-form-item-extra {
    color: rgba(231, 238, 251, 0.72);
    font-weight: 700;
  }

  .ant-input-number,
  .ant-select {
    width: 100%;
  }

  @media (max-width: 1180px) {
    position: static;
  }
`;

export const PanelTitle = styled.div`
  margin-bottom: 20px;

  span {
    color: #9df8dc;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 6px 0 8px;
    color: #ffffff;
    font-size: clamp(24px, 3vw, 34px);
  }

  p {
    margin: 0;
    color: rgba(231, 238, 251, 0.64);
    line-height: 1.65;
  }
`;

export const TableCard = styled(Card)`
  border-color: rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);

  & + & {
    margin-top: 24px;
  }

  .ant-card-head {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .ant-card-head-title,
  .ant-table-thead > tr > th {
    color: #ffffff;
    font-weight: 900;
  }

  .ant-card-extra a {
    color: #9df8dc;
    font-weight: 800;
  }

  .ant-table {
    color: rgba(231, 238, 251, 0.84);
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: rgba(255, 255, 255, 0.07) !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }

  .ant-table-tbody > tr > td {
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.025);
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(32, 208, 163, 0.08) !important;
  }

  p {
    margin: 4px 0 0;
    color: rgba(231, 238, 251, 0.58);
  }
`;

export const FilterBar = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(180px, 0.3fr) minmax(180px, 0.3fr);
  gap: 12px;
  margin-bottom: 16px;

  .ant-input-affix-wrapper,
  .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.08) !important;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
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
