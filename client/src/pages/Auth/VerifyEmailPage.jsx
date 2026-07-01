import { useEffect, useState } from 'react';
import { Button, Result } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { t } = usePreferences();
  const [status, setStatus] = useState('info');
  const [message, setMessage] = useState(() => t('auth.verifyChecking'));

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('warning');
      setMessage(t('auth.verifyMissing'));
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage(t('auth.verifySuccess'));
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.response?.data?.message || t('auth.verifyError'));
      });
  }, [searchParams, t]);

  return (
    <Result
      status={status}
      title={message}
      extra={(
        <Button type="primary">
          <Link to="/apartments">{t('common.backToApartments')}</Link>
        </Button>
      )}
    />
  );
}
