import { App as AntdApp, Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/apiClient.js';
import { LoginCard, LoginPageWrap } from './styles.js';

export function LoginPage() {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleSubmit = async (values) => {
    try {
      await login(values);
      message.success('Đăng nhập thành công.');
      navigate('/admin', { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại.');
    }
  };

  return (
    <LoginPageWrap>
      <LoginCard>
        <span>Bảo mật bằng HTTP-only cookie</span>
        <h1>Đăng nhập quản trị</h1>
        <p>Đăng nhập bằng tài khoản admin đã seed: admin@example.com / Admin@123456.</p>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={{ email: 'admin@example.com' }}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 8 }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="********" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form>
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký khách hàng</Link>
        </p>
      </LoginCard>
    </LoginPageWrap>
  );
}
