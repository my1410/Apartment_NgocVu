import { useEffect, useState } from 'react';
import { Button, Result } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../services/apiClient.js';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('info');
  const [message, setMessage] = useState('Đang xác nhận email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('warning');
      setMessage('Thiếu token xác nhận email.');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email đã được xác nhận thành công.');
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Không thể xác nhận email.');
      });
  }, [searchParams]);

  return (
    <Result
      status={status}
      title={message}
      extra={(
        <Button type="primary">
          <Link to="/apartments">Về danh mục căn hộ</Link>
        </Button>
      )}
    />
  );
}
