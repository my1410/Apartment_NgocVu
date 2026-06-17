import { App as AntdApp, Button, Form, Input } from 'antd';
import { HomeOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/apiClient.js';
import { LoginCard, LoginPageWrap } from './styles.js';

export function RegisterPage() {
  const { message, modal } = AntdApp.useApp();
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

      message.success('Đăng ký thành công. Vui lòng xác nhận email.');
      if (data.verificationPreviewUrl) {
        modal.info({
          title: 'Link xác nhận email môi trường dev',
          content: (
            <div>
              <p>Chưa cấu hình SMTP, dùng link này để test xác nhận email:</p>
              <a href={data.verificationPreviewUrl}>{data.verificationPreviewUrl}</a>
            </div>
          )
        });
      }
      navigate('/apartments', { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại.');
    }
  };

  return (
    <LoginPageWrap>
      <LoginCard>
        <span>Tài khoản khách hàng</span>
        <h1>Đăng ký</h1>
        <p>Tạo tài khoản để lưu căn hộ ưa thích, gửi nhu cầu cho admin và nhận tư vấn.</p>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, min: 2 }]}>
            <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="email" label="Gmail" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@gmail.com" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 8 }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 8 ký tự" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, min: 8 }]}>
            <Input prefix={<PhoneOutlined />} placeholder="0900000000" />
          </Form.Item>
          <Form.Item name="street" label="Địa chỉ nơi ở" rules={[{ required: true, min: 2 }]}>
            <Input prefix={<HomeOutlined />} placeholder="Số nhà, tên đường" />
          </Form.Item>
          <Form.Item name="ward" label="Phường/Xã">
            <Input placeholder="Hải Châu I" />
          </Form.Item>
          <Form.Item name="district" label="Quận/Huyện">
            <Input placeholder="Hải Châu" />
          </Form.Item>
          <Form.Item name="city" label="Tỉnh/Thành phố" initialValue="Đà Nẵng">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo tài khoản
          </Button>
        </Form>
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </LoginCard>
    </LoginPageWrap>
  );
}
