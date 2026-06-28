import { useEffect, useState } from 'react';
import { App as AntdApp, Button, Form, Input, Spin, Tag } from 'antd';
import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, updateCurrentUser } from '../../services/apiClient.js';
import { AccountActionGrid, AccountPageWrap, AccountPanel } from './styles.js';

export function AccountPage() {
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        form.setFieldsValue({
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          street: currentUser.address?.street,
          ward: currentUser.address?.ward,
          district: currentUser.address?.district,
          city: currentUser.address?.city || 'Đà Nẵng'
        });
      })
      .catch(() => {
        message.warning('Bạn cần đăng nhập để quản lý tài khoản.');
        navigate('/login', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [form, message, navigate]);

  const handleSubmit = async (values) => {
    try {
      const updatedUser = await updateCurrentUser({
        name: values.name,
        phone: values.phone,
        address: {
          street: values.street,
          ward: values.ward,
          district: values.district,
          city: values.city || 'Đà Nẵng'
        }
      });
      setUser(updatedUser);
      message.success('Đã cập nhật tài khoản.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể cập nhật tài khoản.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <AccountPageWrap>
        <Spin size="large" />
      </AccountPageWrap>
    );
  }

  return (
    <AccountPageWrap>
      <AccountPanel>
        <span>Hồ sơ khách hàng</span>
        <h1>Quản lý tài khoản của tôi</h1>
        <p>
          Cập nhật số điện thoại và địa chỉ để admin liên hệ đúng khi bạn lưu căn hộ ưa thích hoặc gửi nhu cầu tư vấn.
        </p>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, min: 2 }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input prefix={<MailOutlined />} disabled />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, min: 8 }]}>
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>
          <Form.Item name="street" label="Địa chỉ nơi ở" rules={[{ required: true, min: 2 }]}>
            <Input prefix={<HomeOutlined />} />
          </Form.Item>
          <Form.Item name="ward" label="Phường/Xã">
            <Input />
          </Form.Item>
          <Form.Item name="district" label="Quận/Huyện">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Tỉnh/Thành phố">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu thông tin tài khoản
          </Button>
        </Form>
      </AccountPanel>

      <AccountPanel>
        <span>Tổng quan</span>
        <h2>{user?.name || user?.email}</h2>
        <p>{user?.email}</p>
        <p>
          Trạng thái email:{' '}
          {user?.emailVerified ? <Tag color="green">Đã xác thực</Tag> : <Tag color="orange">Chưa xác thực</Tag>}
        </p>
        <AccountActionGrid>
          <Button type="primary" size="large">
            <Link to="/favorites">Quản lý căn hộ ưa thích</Link>
          </Button>
          <Button size="large">
            <Link to="/contact">Gửi yêu cầu tư vấn</Link>
          </Button>
          {user?.role === 'admin' && (
            <Button size="large">
              <Link to="/admin">Vào trang admin</Link>
            </Button>
          )}
          <Button danger size="large" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </AccountActionGrid>
      </AccountPanel>
    </AccountPageWrap>
  );
}
