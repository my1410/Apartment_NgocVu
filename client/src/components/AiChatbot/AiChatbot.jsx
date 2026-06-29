import { Button, Input, List, Space } from 'antd';
import { CloseOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { askAssistant } from '../../services/apiClient.js';
import { Bubble, ChatButton, ChatPanel, Composer, Header, Messages, SuggestionBar } from './styles.js';

const welcomeMessage = {
  role: 'assistant',
  content: 'Chào bạn, mình có thể gợi ý căn hộ theo quận, ngân sách, số phòng ngủ hoặc nhu cầu đầu tư/ở thật.'
};

const suggestions = [
  'Gợi ý căn 2PN ở Hải Châu dưới 3 tỷ',
  'Tôi muốn căn gần biển để cho thuê',
  'Căn nào phù hợp gia đình trẻ?'
];

export function AiChatbot({ apartments = [] }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([welcomeMessage]);
  const [loading, setLoading] = useState(false);

  const context = useMemo(() => ({
    totalApartments: apartments.length,
    districts: [...new Set(apartments.map((apartment) => apartment.districtLabel).filter(Boolean))],
    apartments: apartments.slice(0, 24).map((apartment) => ({
      id: apartment.id,
      title: apartment.title,
      district: apartment.district,
      districtLabel: apartment.districtLabel,
      ward: apartment.ward,
      price: apartment.price,
      priceLabel: apartment.priceLabel,
      area: apartment.area,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      status: apartment.status,
      availableUnits: apartment.availableUnits,
      featured: apartment.featured,
      tags: apartment.tags
    }))
  }), [apartments]);

  const sendMessage = async (overrideMessage) => {
    const trimmed = (overrideMessage ?? message).trim();
    if (!trimmed) return;

    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setMessage('');
    setLoading(true);
    try {
      const reply = await askAssistant(trimmed, context);
      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
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
            <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={() => sendMessage()} />
          </Composer>
          <SuggestionBar>
            <Space size={[8, 8]} wrap>
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  size="small"
                  disabled={loading}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Space>
          </SuggestionBar>
        </ChatPanel>
      )}
      <ChatButton type="primary" shape="circle" icon={<MessageOutlined />} onClick={() => setOpen(true)} />
    </>
  );
}
