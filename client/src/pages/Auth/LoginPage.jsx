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
      const user = await login(values);
      message.success('Đăng nhập thành công.');
      navigate(user.role === 'admin' ? '/admin' : '/account', { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại.');
    }
  };

  return (
    <LoginPageWrap>
      <LoginCard>
        <span>Bảo mật bằng HTTP-only cookie</span>
        <h1>Đăng nhập</h1>
        <p>Khách hàng vào quản lý tài khoản và căn hộ ưa thích. Admin sẽ được chuyển vào bảng quản trị.</p>
        <Form layout="vertical" onFinish={handleSubmit}>
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
