import { App as AntdApp, Button, Form, Input } from 'antd';
import { HomeOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { LoginCard, LoginPageWrap } from './styles.js';

export function RegisterPage() {
  const { message, modal } = AntdApp.useApp();
  const { t } = usePreferences();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const data = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: {
          street: values.street,
          ward: values.ward,
          district: values.district,
          city: values.city || 'Đà Nẵng'
        }
      });

      message.success(t('auth.registerSuccess'));
      if (data.verificationPreviewUrl) {
        modal.info({
          title: t('auth.devVerificationTitle'),
          content: (
            <div>
              <p>{t('auth.devVerificationText')}</p>
              <a href={data.verificationPreviewUrl}>{data.verificationPreviewUrl}</a>
            </div>
          )
        });
      }
      navigate('/apartments', { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || t('auth.registerError'));
    }
  };

  return (
    <LoginPageWrap>
      <LoginCard>
        <span>{t('auth.registerBadge')}</span>
        <h1>{t('auth.registerTitle')}</h1>
        <p>{t('auth.registerDescription')}</p>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label={t('auth.name')} rules={[{ required: true, min: 2 }]}>
            <Input prefix={<UserOutlined />} placeholder={t('auth.placeholderName')} />
          </Form.Item>
          <Form.Item name="email" label="Gmail" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@gmail.com" />
          </Form.Item>
          <Form.Item name="password" label={t('auth.password')} rules={[{ required: true, min: 8 }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.minPassword')} />
          </Form.Item>
          <Form.Item name="phone" label={t('auth.phone')} rules={[{ required: true, min: 8 }]}>
            <Input prefix={<PhoneOutlined />} placeholder="0900000000" />
          </Form.Item>
          <Form.Item name="street" label={t('auth.street')} rules={[{ required: true, min: 2 }]}>
            <Input prefix={<HomeOutlined />} placeholder={t('auth.placeholderStreet')} />
          </Form.Item>
          <Form.Item name="ward" label={t('auth.ward')}>
            <Input placeholder={t('auth.placeholderWard')} />
          </Form.Item>
          <Form.Item name="district" label={t('auth.district')}>
            <Input placeholder={t('auth.placeholderDistrict')} />
          </Form.Item>
          <Form.Item name="city" label={t('auth.city')} initialValue="Đà Nẵng">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t('auth.createAccount')}
          </Button>
        </Form>
        <p>
          {t('auth.hasAccount')} <Link to="/login">{t('common.login')}</Link>
        </p>
      </LoginCard>
    </LoginPageWrap>
  );
}
