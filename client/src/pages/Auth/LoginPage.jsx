import { App as AntdApp, Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { LoginCard, LoginPageWrap } from './styles.js';

export function LoginPage() {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { t } = usePreferences();

  const handleSubmit = async (values) => {
    try {
      const user = await login(values);
      message.success(t('auth.loginSuccess'));
      navigate(user.role === 'admin' ? '/admin' : '/account', { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || t('auth.loginError'));
    }
  };

  return (
    <LoginPageWrap>
      <LoginCard>
        <span>{t('auth.loginBadge')}</span>
        <h1>{t('auth.loginTitle')}</h1>
        <p>{t('auth.loginDescription')}</p>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item name="password" label={t('auth.password')} rules={[{ required: true, min: 8 }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="********" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t('common.login')}
          </Button>
        </Form>
        <p>
          {t('auth.noAccount')} <Link to="/register">{t('auth.registerCustomer')}</Link>
        </p>
      </LoginCard>
    </LoginPageWrap>
  );
}
