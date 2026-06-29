import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Card, Col, Empty, Row, Space, Spin } from 'antd';
import {
  ArrowRightOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ApartmentCard } from '../../components/ApartmentCard/ApartmentCard.jsx';
import { FeaturedStats } from '../../components/FeaturedStats/FeaturedStats.jsx';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader.jsx';
import {
  createInterest,
  getApartments,
  getCurrentUser,
  getFavorites,
  toggleFavorite
} from '../../services/apiClient.js';
import { resolveAddressLocation, scoreApartmentByAddress } from '../../utils/locationMatch.js';
import { ApartmentGrid, FeatureCard, HeroActions, HomeHero, HomeWrap, NearbyPanel, Section } from './styles.js';

export function HomePage() {
  const { message } = AntdApp.useApp();
  const [apartments, setApartments] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    Promise.all([
      getApartments(),
      getCurrentUser().catch(() => null),
      getFavorites().catch(() => [])
    ]).then(([items, currentUser, favorites]) => {
      setApartments(items);
      setUser(currentUser);
      setFavoriteIds(favorites.map((apartment) => apartment.id));
      setLoadingNearby(false);
    });
  }, []);

  const userLocation = useMemo(() => resolveAddressLocation(user?.address), [user]);
  const nearbyApartments = useMemo(() => apartments
    .map((apartment) => ({
      apartment,
      score: scoreApartmentByAddress(apartment, userLocation)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ apartment }) => apartment), [apartments, userLocation]);
  const nearbyLink = userLocation.district
    ? `/apartments?district=${userLocation.district}${userLocation.ward ? `&ward=${encodeURIComponent(userLocation.ward)}` : ''}`
    : '/apartments';

  const handleFavorite = async (apartment) => {
    if (!user) {
      message.warning('Bạn cần đăng nhập để lưu căn hộ ưa thích.');
      return;
    }
    const result = await toggleFavorite(apartment.id);
    setFavoriteIds(result.favoriteIds);
    message.success(result.favorited ? 'Đã thêm vào căn hộ ưa thích.' : 'Đã bỏ khỏi danh sách ưa thích.');
  };

  const handleInterest = async (apartment) => {
    if (!user) {
      message.warning('Bạn cần đăng nhập để gửi nhu cầu cho admin.');
      return;
    }
    await createInterest(apartment.id, 'Khách hàng quan tâm căn hộ gần địa chỉ đăng ký.');
    message.success('Admin đã nhận được nhu cầu của bạn và sẽ liên hệ lại.');
  };

  return (
    <HomeWrap>
      <HomeHero>
        <span>DN Apartment Hub</span>
        <h1>Đối tác tìm căn hộ hiện đại tại Đà Nẵng.</h1>
        <p>
          Chúng tôi kết nối khách hàng với căn hộ đã chọn lọc theo vị trí, pháp lý, ngân sách,
          bản đồ và nhu cầu sống thực tế. Tất cả được tối ưu bằng dữ liệu, AI gợi ý và đội ngũ tư vấn địa phương.
        </p>
        <HeroActions>
          <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
            <Link to="/apartments">Xem danh mục căn hộ</Link>
          </Button>
          <Button size="large">
            <Link to="/contact">Liên hệ tư vấn</Link>
          </Button>
        </HeroActions>
      </HomeHero>

      <FeaturedStats />

      <Section>
        <SectionHeader
          eyebrow="Căn hộ gần bạn"
          title="Gợi ý theo địa chỉ đăng ký của tài khoản"
          description="Hệ thống đọc quận/phường từ địa chỉ bạn đã đăng ký, sau đó ưu tiên căn hộ cùng khu vực và còn số lượng tư vấn."
        />
        <NearbyPanel>
          <div>
            <strong>
              {userLocation.districtLabel
                ? `Khu vực của bạn: ${userLocation.ward ? `${userLocation.ward}, ` : ''}${userLocation.districtLabel}`
                : 'Chưa xác định được khu vực của bạn'}
            </strong>
            <p>
              {user
                ? userLocation.districtLabel
                  ? `Dựa trên địa chỉ: ${userLocation.fullAddress || 'thông tin tài khoản của bạn'}.`
                  : 'Bạn hãy cập nhật quận/huyện trong tài khoản để hệ thống gợi ý chính xác hơn.'
                : 'Đăng nhập hoặc đăng ký tài khoản có địa chỉ để nhận gợi ý căn hộ gần nơi bạn ở.'}
            </p>
          </div>
          <Space wrap>
            {!user && <Button type="primary"><Link to="/login">Đăng nhập</Link></Button>}
            <Button>
              <Link to={user ? '/account' : '/register'}>{user ? 'Cập nhật địa chỉ' : 'Đăng ký tài khoản'}</Link>
            </Button>
            {userLocation.district && (
              <Button type="primary">
                <Link to={nearbyLink}>Xem tất cả gần tôi</Link>
              </Button>
            )}
          </Space>
        </NearbyPanel>

        {loadingNearby ? (
          <Spin size="large" />
        ) : nearbyApartments.length ? (
          <ApartmentGrid>
            {nearbyApartments.map((apartment, index) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                index={index}
                favorited={favoriteIds.includes(apartment.id)}
                onFavorite={handleFavorite}
                onInterest={handleInterest}
              />
            ))}
          </ApartmentGrid>
        ) : (
          <Empty description={user ? 'Chưa có căn hộ trùng khu vực địa chỉ của bạn' : 'Đăng nhập để xem căn hộ gần bạn'} />
        )}
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Tính năng nổi bật"
          title="Một nền tảng căn hộ gọn, nhanh và có dữ liệu rõ ràng"
          description="Tìm theo quận/phường, xem vị trí trên map, lưu căn hộ yêu thích và gửi nhu cầu để tư vấn viên liên hệ."
        />
        <Row gutter={[18, 18]}>
          <Col xs={24} md={8}>
            <FeatureCard as={Link} to="/apartments">
              <EnvironmentOutlined />
              <h3>Lọc theo khu vực</h3>
              <p>Chọn Hải Châu, Sơn Trà, Ngũ Hành Sơn hoặc từng phường để xem đúng căn hộ trong khu vực.</p>
            </FeatureCard>
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard as={Link} to="/favorites">
              <HeartOutlined />
              <h3>Căn hộ ưa thích</h3>
              <p>Lưu căn hộ bạn quan tâm, gửi tín hiệu cho admin và nhận tư vấn dựa trên nhu cầu thật.</p>
            </FeatureCard>
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard as={Link} to="/account#security">
              <SafetyCertificateOutlined />
              <h3>Bảo mật tài khoản</h3>
              <p>Xác minh email, cookie HTTP-only và đổi mật khẩu trong trung tâm bảo mật tài khoản.</p>
            </FeatureCard>
          </Col>
        </Row>
      </Section>

      <Section id="contact">
        <Card>
          <Space direction="vertical" size={14}>
            <SectionHeader
              eyebrow="Liên hệ"
              title="Cần tư vấn căn hộ phù hợp?"
              description="Để lại căn hộ yêu thích trong danh mục, admin sẽ thấy nhu cầu và liên hệ lại theo thông tin tài khoản của bạn."
            />
            <p><CustomerServiceOutlined /> Hotline: 0900 000 000</p>
            <p>Email: support@dnapartmenthub.vn</p>
            <Button type="primary">
              <Link to="/contact">Gửi yêu cầu tư vấn</Link>
            </Button>
          </Space>
        </Card>
      </Section>
    </HomeWrap>
  );
}
