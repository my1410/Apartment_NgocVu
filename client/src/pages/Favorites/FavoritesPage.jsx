import { useCallback, useEffect, useState } from 'react';
import { App as AntdApp, Button, Card, Empty, Space, Spin, Statistic } from 'antd';
import { CustomerServiceOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ApartmentCard } from '../../components/ApartmentCard/ApartmentCard.jsx';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader.jsx';
import { createInterest, getFavorites, toggleFavorite } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { ApartmentGrid, HomeWrap, Section } from '../Home/styles.js';

export function FavoritesPage() {
  const { message } = AntdApp.useApp();
  const { t } = usePreferences();
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const items = await getFavorites();
      setApartments(items);
    } catch {
      message.warning(t('favorites.needLogin'));
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [message, navigate, t]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleFavorite = async (apartment) => {
    await toggleFavorite(apartment.id);
    message.success(t('favorites.removed'));
    loadFavorites();
  };

  const handleInterest = async (apartment) => {
    await createInterest(apartment.id, 'Khách hàng gửi nhu cầu từ trang căn hộ ưa thích.');
    message.success(t('favorites.interestSent'));
  };

  return (
    <HomeWrap>
      <Section>
        <SectionHeader
          eyebrow={t('favorites.eyebrow')}
          title={t('favorites.title')}
          description={t('favorites.description')}
        />
        <Card>
          <Space size={18} wrap>
            <Statistic title={t('favorites.saved')} value={apartments.length} prefix={<HeartOutlined />} />
            <Button icon={<UserOutlined />}>
              <Link to="/account">{t('account.manage')}</Link>
            </Button>
            <Button type="primary" icon={<CustomerServiceOutlined />}>
              <Link to="/contact">{t('common.sendConsultation')}</Link>
            </Button>
          </Space>
        </Card>
        {loading ? (
          <Spin size="large" />
        ) : apartments.length ? (
          <ApartmentGrid>
            {apartments.map((apartment, index) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                index={index}
                favorited
                onFavorite={handleFavorite}
                onInterest={handleInterest}
              />
            ))}
          </ApartmentGrid>
        ) : (
          <Empty
            description={t('favorites.empty')}
          >
            <Button type="primary">
              <Link to="/apartments">{t('common.viewApartments')}</Link>
            </Button>
          </Empty>
        )}
      </Section>
    </HomeWrap>
  );
}
