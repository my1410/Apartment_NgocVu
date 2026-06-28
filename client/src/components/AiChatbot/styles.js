import styled from 'styled-components';
import { Button } from 'antd';

export const ChatButton = styled(Button)`
  position: fixed;
  right: 26px;
  bottom: 26px;
  z-index: 80;
  width: 62px !important;
  height: 62px !important;
  box-shadow: 0 18px 40px rgba(32, 208, 163, 0.34);
`;

export const ChatPanel = styled.aside`
  position: fixed;
  right: 26px;
  bottom: 100px;
  z-index: 80;
  width: min(410px, calc(100vw - 28px));
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  background: rgba(6, 17, 31, 0.92);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(22px);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  strong,
  span {
    display: block;
  }

  strong {
    color: #ffffff;
    font-size: 17px;
  }

  span {
    color: #9df8dc;
    font-size: 13px;
    font-weight: 700;
  }
`;

export const Messages = styled.div`
  max-height: 370px;
  padding: 18px;
  overflow-y: auto;

  .ant-list-item {
    border-block-end: 0 !important;
    padding: 5px 0;
  }
`;

export const Bubble = styled.div`
  width: fit-content;
  max-width: 88%;
  margin-left: ${({ $role }) => ($role === 'user' ? 'auto' : 0)};
  padding: 12px 14px;
  border-radius: ${({ $role }) => ($role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px')};
  color: ${({ $role }) => ($role === 'user' ? '#06111f' : '#e7eefb')};
  background: ${({ $role }) => ($role === 'user' ? '#20d0a3' : 'rgba(255, 255, 255, 0.1)')};
  line-height: 1.5;
`;

export const Composer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SuggestionBar = styled.div`
  padding: 0 14px 14px;

  .ant-btn {
    border-color: rgba(157, 248, 220, 0.22);
    color: #d9fff3;
    background: rgba(32, 208, 163, 0.08);
  }
`;
