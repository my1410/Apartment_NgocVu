import { useEffect } from 'react';
import { App as AntdApp, Button, Form, Input, Select } from 'antd';
import { CustomerServiceOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { daNangLocations } from '../../data/vietnamLocations.js';
import { createContactRequest, getCurrentUser } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { ContactCard, ContactHero, ContactInfoGrid, ContactPageWrap } from './styles.js';

export function ContactPage() {
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const { t } = usePreferences();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          district: user.address?.district
        });
      })
      .catch(() => {});
  }, [form]);

  const handleSubmit = async (values) => {
    try {
      await createContactRequest(values);
      message.success(t('contact.sent'));
      form.resetFields(['budget', 'message']);
    } catch (error) {
      message.error(error.response?.data?.message || t('contact.error'));
    }
  };

  return (
    <ContactPageWrap>
      <ContactHero>
        <span>{t('contact.badge')}</span>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.description')}</p>
        <ContactInfoGrid>
          <div>
            <strong><PhoneOutlined /> Hotline</strong>
            <p>{t('contact.hotlineText')}</p>
          </div>
          <div>
            <strong><MailOutlined /> Email</strong>
            <p>support@dnapartmenthub.vn</p>
          </div>
          <div>
            <strong><CustomerServiceOutlined /> {t('contact.quickTitle')}</strong>
            <p>{t('contact.quickText')}</p>
          </div>
        </ContactInfoGrid>
      </ContactHero>

      <ContactCard>
        <h2>{t('contact.formTitle')}</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label={t('auth.name')} rules={[{ required: true, min: 2 }]}>
            <Input prefix={<UserOutlined />} placeholder={t('auth.placeholderName')} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@gmail.com" />
          </Form.Item>
          <Form.Item name="phone" label={t('auth.phone')} rules={[{ required: true, min: 8 }]}>
            <Input prefix={<PhoneOutlined />} placeholder="0900000000" />
          </Form.Item>
          <Form.Item name="district" label={t('contact.area')}>
            <Select
              allowClear
              placeholder={t('filters.district')}
              options={daNangLocations.map((item) => ({ label: item.label, value: item.label }))}
            />
          </Form.Item>
          <Form.Item name="budget" label={t('contact.budget')}>
            <Input placeholder={t('contact.budgetPlaceholder')} />
          </Form.Item>
          <Form.Item name="message" label={t('contact.detail')} rules={[{ required: true, min: 10 }]}>
            <Input.TextArea rows={5} placeholder={t('contact.detailPlaceholder')} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t('contact.submit')}
          </Button>
        </Form>
      </ContactCard>
    </ContactPageWrap>
  );
}
