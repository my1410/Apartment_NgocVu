import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Empty, Space, Spin } from 'antd';
import {
  ArrowRightOutlined,
  BarChartOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HomeOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ApartmentCard } from '../../components/ApartmentCard/ApartmentCard.jsx';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader.jsx';
import {
  createInterest,
  getApartments,
  getCurrentUser,
  getFavorites,
  toggleFavorite
} from '../../services/apiClient.js';
import { resolveAddressLocation, scoreApartmentByAddress } from '../../utils/locationMatch.js';
import {
  ApartmentGrid,
  ContactCard,
  FeatureCard,
  FeatureGrid,
  HeroActions,
  HeroCopy,
  HeroMetric,
  HeroMetrics,
  HeroOrbit,
  HeroPreview,
  HomeHero,
  HomeWrap,
  NearbyPanel,
  Section,
  VisualCard
} from './styles.js';

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 }
};

const MotionLink = motion.create(Link);

const heroStats = [
  { icon: <HomeOutlined />, label: 'Căn hộ chọn lọc', value: '128+' },
  { icon: <BarChartOutlined />, label: 'Khu vực hỗ trợ', value: '42' },
  { icon: <SafetyCertificateOutlined />, label: 'Tin xác thực', value: '96%' }
];

const features = [
  {
    to: '/apartments',
    icon: <EnvironmentOutlined />,
    title: 'Lọc theo khu vực',
    description: 'Chọn quận, phường, giá, diện tích và trạng thái còn hàng trong một màn hình gọn.'
  },
  {
    to: '/favorites',
    icon: <HeartOutlined />,
    title: 'Căn hộ ưa thích',
    description: 'Lưu căn phù hợp, gửi tín hiệu cho admin và nhận tư vấn theo nhu cầu thật.'
  },
  {
    to: '/account#security',
    icon: <SafetyCertificateOutlined />,
    title: 'Bảo mật tài khoản',
    description: 'Email xác thực, cookie HTTP-only và trung tâm đổi mật khẩu cho khách hàng.'
  }
];

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
      <HomeHero
        initial="hidden"
        animate="visible"
        variants={reveal}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <HeroCopy>
          <span>DN Apartment Hub</span>
          <h1>Tìm căn hộ Đà Nẵng nhanh, đẹp và đúng khu vực.</h1>
          <p>
            Nền tảng gợi ý căn hộ theo vị trí, ngân sách, bản đồ, tồn kho và nhu cầu thực tế.
            Trải nghiệm được tối ưu để khách hàng xem nhanh, lưu nhanh và gửi nhu cầu cho admin ngay.
          </p>
          <HeroActions>
            <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
              <Link to="/apartments">Xem danh mục căn hộ</Link>
            </Button>
            <Button size="large">
              <Link to="/contact">Liên hệ tư vấn</Link>
            </Button>
          </HeroActions>
          <HeroMetrics>
            {heroStats.map((item) => (
              <HeroMetric key={item.label}>
                {item.icon}
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </HeroMetric>
            ))}
          </HeroMetrics>
        </HeroCopy>

        <HeroPreview>
          <HeroOrbit />
          <VisualCard
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: 'easeOut' }}
          >
            <span>AI gợi ý hôm nay</span>
            <h2>Hải Châu ven sông</h2>
            <p>2 phòng ngủ • 78m2 • view sông Hàn • còn 1 căn tư vấn</p>
            <div>
              <small>Độ phù hợp</small>
              <strong>96%</strong>
            </div>
          </VisualCard>
          <VisualCard
            $compact
            initial={{ opacity: 0, y: 24, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.75, delay: 0.32, ease: 'easeOut' }}
          >
            <span>Bản đồ & tồn kho</span>
            <h2>2 vị trí gần bạn</h2>
            <p>Lọc theo địa chỉ đăng ký và trạng thái còn hàng.</p>
          </VisualCard>
        </HeroPreview>
      </HomeHero>

      <Section
        as={motion.section}
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
      >
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

      <Section
        as={motion.section}
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
      >
        <SectionHeader
          eyebrow="Tính năng nổi bật"
          title="Đủ chức năng quan trọng, trình bày sạch và dễ dùng"
          description="Trang chủ chỉ giữ những điểm cần ra quyết định. Các thao tác chi tiết được đưa về danh mục, tài khoản và liên hệ."
        />
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              as={MotionLink}
              to={feature.to}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Section>

      <Section
        id="contact"
        as={motion.section}
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
      >
        <ContactCard>
          <div>
            <span>Liên hệ</span>
            <h2>Cần tư vấn căn hộ phù hợp?</h2>
            <p>
              Lưu căn hộ bạn thích hoặc gửi yêu cầu, admin sẽ nhận được thông tin và liên hệ lại theo tài khoản của bạn.
            </p>
          </div>
          <Space wrap>
            <p><CustomerServiceOutlined /> 0900 000 000</p>
            <Button type="primary">
              <Link to="/contact">Gửi yêu cầu tư vấn</Link>
            </Button>
          </Space>
        </ContactCard>
      </Section>
    </HomeWrap>
  );
}
