import { useCallback, useEffect, useState } from 'react';
import { App as AntdApp, Button, Card, Empty, Space, Spin, Statistic } from 'antd';
import { CustomerServiceOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ApartmentCard } from '../../components/ApartmentCard/ApartmentCard.jsx';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader.jsx';
import { createInterest, getFavorites, toggleFavorite } from '../../services/apiClient.js';
import { ApartmentGrid, HomeWrap, Section } from '../Home/styles.js';

export function FavoritesPage() {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const items = await getFavorites();
      setApartments(items);
    } catch {
      message.warning('Bạn cần đăng nhập để xem căn hộ ưa thích.');
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [message, navigate]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleFavorite = async (apartment) => {
    await toggleFavorite(apartment.id);
    message.success('Đã bỏ khỏi danh sách ưa thích.');
    loadFavorites();
  };

  const handleInterest = async (apartment) => {
    await createInterest(apartment.id, 'Khách hàng gửi nhu cầu từ trang căn hộ ưa thích.');
    message.success('Admin đã nhận được nhu cầu của bạn.');
  };

  return (
    <HomeWrap>
      <Section>
        <SectionHeader
          eyebrow="Căn hộ ưa thích"
          title="Quản lý căn hộ ưa thích của tôi"
          description="Theo dõi căn đã lưu, gửi tín hiệu quan tâm cho admin và cập nhật hồ sơ để tư vấn viên liên hệ đúng thông tin."
        />
        <Card>
          <Space size={18} wrap>
            <Statistic title="Căn đã lưu" value={apartments.length} prefix={<HeartOutlined />} />
            <Button icon={<UserOutlined />}>
              <Link to="/account">Quản lý tài khoản</Link>
            </Button>
            <Button type="primary" icon={<CustomerServiceOutlined />}>
              <Link to="/contact">Gửi yêu cầu tư vấn</Link>
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
            description="Bạn chưa lưu căn hộ nào"
          >
            <Button type="primary">
              <Link to="/apartments">Xem danh mục căn hộ</Link>
            </Button>
          </Empty>
        )}
      </Section>
    </HomeWrap>
  );
}
