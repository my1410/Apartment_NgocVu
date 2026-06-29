import { useEffect, useState } from 'react';
import { App as AntdApp, Button, Form, Input, Spin, Tag } from 'antd';
import {
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  logout,
  resendVerificationEmail,
  updateCurrentUser,
  updatePassword
} from '../../services/apiClient.js';
import {
  AccountActionGrid,
  AccountPageWrap,
  AccountPanel,
  AccountSideStack,
  SecurityItem,
  SecurityList
} from './styles.js';

export function AccountPage() {
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const { message, modal } = AntdApp.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

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

  useEffect(() => {
    if (!loading && location.hash === '#security') {
      document.getElementById('security')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, location.hash]);

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

  const handlePasswordSubmit = async (values) => {
    setSecurityLoading(true);
    try {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      securityForm.resetFields();
      message.success('Đã đổi mật khẩu. Lần đăng nhập sau hãy dùng mật khẩu mới.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationLoading(true);
    try {
      const result = await resendVerificationEmail();
      message.success(result.message || 'Đã gửi lại email xác minh.');
      if (result.data?.verificationPreviewUrl) {
        modal.info({
          title: 'Link xác minh email môi trường dev',
          content: (
            <div>
              <p>Chưa cấu hình SMTP, dùng link này để test xác minh email:</p>
              <a href={result.data.verificationPreviewUrl}>{result.data.verificationPreviewUrl}</a>
            </div>
          )
        });
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể gửi lại email xác minh.');
    } finally {
      setVerificationLoading(false);
    }
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

      <AccountSideStack>
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

        <AccountPanel id="security">
          <span>Bảo mật tài khoản</span>
          <h2><SafetyCertificateOutlined /> Trung tâm bảo mật</h2>
          <p>Kiểm tra xác minh email, cookie đăng nhập HTTP-only và đổi mật khẩu khách hàng.</p>
          <SecurityList>
            <SecurityItem>
              <div>
                <strong>Email xác minh</strong>
                <small>{user?.email}</small>
              </div>
              {user?.emailVerified ? <Tag color="green">Đã xác thực</Tag> : <Tag color="orange">Chưa xác thực</Tag>}
            </SecurityItem>
            <SecurityItem>
              <div>
                <strong>Phiên đăng nhập</strong>
                <small>JWT được lưu trong signed HTTP-only cookie</small>
              </div>
              <Tag color="blue">Đang bảo vệ</Tag>
            </SecurityItem>
          </SecurityList>

          {!user?.emailVerified && (
            <Button
              block
              icon={<MailOutlined />}
              loading={verificationLoading}
              onClick={handleResendVerification}
            >
              Gửi lại email xác minh
            </Button>
          )}

          <Form form={securityForm} layout="vertical" onFinish={handlePasswordSubmit} style={{ marginTop: 18 }}>
            <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true, min: 8 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" />
            </Form.Item>
            <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 8 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 8 ký tự" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Nhập lại mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true, min: 8 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                    return Promise.reject(new Error('Mật khẩu nhập lại chưa khớp.'));
                  }
                })
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={securityLoading}>
              Đổi mật khẩu
            </Button>
          </Form>
        </AccountPanel>
      </AccountSideStack>
    </AccountPageWrap>
  );
}
