import { Button, Input, List, Space } from 'antd';
import { CloseOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { askAssistant } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { Bubble, ChatButton, ChatPanel, Composer, Header, Messages, SuggestionBar } from './styles.js';

export function AiChatbot({ apartments = [] }) {
  const { language, t } = usePreferences();
  const welcomeMessage = useMemo(() => ({
    role: 'assistant',
    content: t('chat.welcome')
  }), [t]);
  const suggestions = useMemo(() => [
    t('chat.suggest1'),
    t('chat.suggest2'),
    t('chat.suggest3')
  ], [t]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([welcomeMessage]);
  const [loading, setLoading] = useState(false);
  const sendingRef = useRef(false);

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

  useEffect(() => {
    setMessages([welcomeMessage]);
  }, [language, welcomeMessage]);

  const sendMessage = async (overrideMessage) => {
    const trimmed = (overrideMessage ?? message).trim();
    if (!trimmed || sendingRef.current) return;

    sendingRef.current = true;
    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setMessage('');
    setLoading(true);
    try {
      const reply = await askAssistant(trimmed, context);
      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <ChatPanel>
          <Header>
            <div>
              <strong>{t('chat.title')}</strong>
              <span>{t('chat.online')}</span>
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
              placeholder={t('chat.placeholder')}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onPressEnter={(event) => {
                if (!event.shiftKey) {
                  event.preventDefault();
                  if (!event.repeat) sendMessage();
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
