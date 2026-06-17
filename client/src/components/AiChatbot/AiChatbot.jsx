import { Button, Input, List } from 'antd';
import { CloseOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { askAssistant } from '../../services/apiClient.js';
import { Bubble, ChatButton, ChatPanel, Composer, Header, Messages } from './styles.js';

const welcomeMessage = {
  role: 'assistant',
  content: 'Chào bạn, mình có thể gợi ý căn hộ theo quận, ngân sách, số phòng ngủ hoặc nhu cầu đầu tư/ở thật.'
};

export function AiChatbot({ apartments }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([welcomeMessage]);
  const [loading, setLoading] = useState(false);

  const context = useMemo(() => ({
    totalApartments: apartments.length,
    districts: [...new Set(apartments.map((apartment) => apartment.districtLabel))]
  }), [apartments]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setMessage('');
    setLoading(true);
    const reply = await askAssistant(trimmed, context);
    setMessages((current) => [...current, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <>
      {open && (
        <ChatPanel>
          <Header>
            <div>
              <strong>AI tư vấn căn hộ</strong>
              <span>Online 24/7</span>
            </div>
            <Button shape="circle" icon={<CloseOutlined />} onClick={() => setOpen(false)} />
          </Header>
          <Messages>
            <List
              dataSource={messages}
              renderItem={(item) => (
                <Bubble $role={item.role}>{item.content}</Bubble>
              )}
            />
          </Messages>
          <Composer>
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="Ví dụ: Tìm căn 2PN ở Hải Châu dưới 3 tỷ"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onPressEnter={(event) => {
                if (!event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={sendMessage} />
          </Composer>
        </ChatPanel>
      )}
      <ChatButton type="primary" shape="circle" icon={<MessageOutlined />} onClick={() => setOpen(true)} />
    </>
  );
}
