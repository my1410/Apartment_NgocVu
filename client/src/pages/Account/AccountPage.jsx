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
import { usePreferences } from '../../context/AppPreferences.jsx';

export function AccountPage() {
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const { message, modal } = AntdApp.useApp();
  const { t } = usePreferences();
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
        message.warning(t('account.needLogin'));
        navigate('/login', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [form, message, navigate, t]);

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
      message.success(t('account.updated'));
    } catch (error) {
      message.error(error.response?.data?.message || t('account.updateError'));
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
      message.success(t('account.passwordChanged'));
    } catch (error) {
      message.error(error.response?.data?.message || t('account.passwordError'));
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationLoading(true);
    try {
      const result = await resendVerificationEmail();
      message.success(result.message || t('account.resendSent'));
      if (result.data?.verificationPreviewUrl) {
        modal.info({
          title: t('auth.devVerificationTitle'),
          content: (
            <div>
              <p>{t('auth.devVerificationText')}</p>
              <a href={result.data.verificationPreviewUrl}>{result.data.verificationPreviewUrl}</a>
            </div>
          )
        });
      }
    } catch (error) {
      message.error(error.response?.data?.message || t('account.resendError'));
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
        <span>{t('account.profileBadge')}</span>
        <h1>{t('account.title')}</h1>
        <p>{t('account.description')}</p>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label={t('auth.name')} rules={[{ required: true, min: 2 }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input prefix={<MailOutlined />} disabled />
          </Form.Item>
          <Form.Item name="phone" label={t('auth.phone')} rules={[{ required: true, min: 8 }]}>
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>
          <Form.Item name="street" label={t('auth.street')} rules={[{ required: true, min: 2 }]}>
            <Input prefix={<HomeOutlined />} />
          </Form.Item>
          <Form.Item name="ward" label={t('auth.ward')}>
            <Input />
          </Form.Item>
          <Form.Item name="district" label={t('auth.district')}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label={t('auth.city')}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t('account.save')}
          </Button>
        </Form>
      </AccountPanel>

      <AccountSideStack>
        <AccountPanel>
          <span>{t('account.overview')}</span>
          <h2>{user?.name || user?.email}</h2>
          <p>{user?.email}</p>
          <p>
            {t('account.emailStatus')}{' '}
            {user?.emailVerified ? <Tag color="green">{t('account.verified')}</Tag> : <Tag color="orange">{t('account.unverified')}</Tag>}
          </p>
          <AccountActionGrid>
            <Button type="primary" size="large">
              <Link to="/favorites">{t('favorites.title')}</Link>
            </Button>
            <Button size="large">
              <Link to="/contact">{t('common.sendConsultation')}</Link>
            </Button>
            {user?.role === 'admin' && (
              <Button size="large">
                <Link to="/admin">{t('account.admin')}</Link>
              </Button>
            )}
            <Button danger size="large" onClick={handleLogout}>
              {t('common.logout')}
            </Button>
          </AccountActionGrid>
        </AccountPanel>

        <AccountPanel id="security">
          <span>{t('account.securityBadge')}</span>
          <h2><SafetyCertificateOutlined /> {t('account.securityTitle')}</h2>
          <p>{t('account.securityDescription')}</p>
          <SecurityList>
            <SecurityItem>
              <div>
                <strong>{t('account.emailVerification')}</strong>
                <small>{user?.email}</small>
              </div>
              {user?.emailVerified ? <Tag color="green">{t('account.verified')}</Tag> : <Tag color="orange">{t('account.unverified')}</Tag>}
            </SecurityItem>
            <SecurityItem>
              <div>
                <strong>{t('account.session')}</strong>
                <small>{t('account.sessionDescription')}</small>
              </div>
              <Tag color="blue">{t('account.protected')}</Tag>
            </SecurityItem>
          </SecurityList>

          {!user?.emailVerified && (
            <Button
              block
              icon={<MailOutlined />}
              loading={verificationLoading}
              onClick={handleResendVerification}
            >
              {t('account.resendVerification')}
            </Button>
          )}

          <Form form={securityForm} layout="vertical" onFinish={handlePasswordSubmit} style={{ marginTop: 18 }}>
            <Form.Item name="currentPassword" label={t('account.currentPassword')} rules={[{ required: true, min: 8 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder={t('account.currentPassword')} />
            </Form.Item>
            <Form.Item name="newPassword" label={t('account.newPassword')} rules={[{ required: true, min: 8 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder={t('auth.minPassword')} />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={t('account.confirmPassword')}
              dependencies={['newPassword']}
              rules={[
                { required: true, min: 8 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                    return Promise.reject(new Error(t('account.passwordMismatch')));
                  }
                })
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder={t('account.confirmPassword')} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={securityLoading}>
              {t('account.changePassword')}
            </Button>
          </Form>
        </AccountPanel>
      </AccountSideStack>
    </AccountPageWrap>
  );
}
