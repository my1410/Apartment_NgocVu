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
  getPersonalRecommendations,
  toggleFavorite
} from '../../services/apiClient.js';
import { resolveAddressLocation, scoreApartmentByAddress } from '../../utils/locationMatch.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
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
  { icon: <HomeOutlined />, labelKey: 'home.metric.apartments', value: '128+' },
  { icon: <BarChartOutlined />, labelKey: 'home.metric.areas', value: '42' },
  { icon: <SafetyCertificateOutlined />, labelKey: 'home.metric.verified', value: '96%' }
];

const features = [
  {
    to: '/apartments',
    icon: <EnvironmentOutlined />,
    titleKey: 'home.feature.locationTitle',
    descriptionKey: 'home.feature.locationDescription'
  },
  {
    to: '/favorites',
    icon: <HeartOutlined />,
    titleKey: 'home.feature.favoriteTitle',
    descriptionKey: 'home.feature.favoriteDescription'
  },
  {
    to: '/account#security',
    icon: <SafetyCertificateOutlined />,
    titleKey: 'home.feature.securityTitle',
    descriptionKey: 'home.feature.securityDescription'
  }
];

export function HomePage() {
  const { message } = AntdApp.useApp();
  const { t } = usePreferences();
  const [apartments, setApartments] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [personalRecommendations, setPersonalRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingNearby, setLoadingNearby] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(false);

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
      if (currentUser) {
        setLoadingPersonal(true);
        getPersonalRecommendations()
          .then((result) => setPersonalRecommendations(result.apartments || []))
          .catch(() => setPersonalRecommendations([]))
          .finally(() => setLoadingPersonal(false));
      }
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
      message.warning(t('apartments.loginToFavorite'));
      return;
    }
    const result = await toggleFavorite(apartment.id);
    setFavoriteIds(result.favoriteIds);
    message.success(result.favorited ? t('apartments.favoriteAdded') : t('apartments.favoriteRemoved'));
  };

  const handleInterest = async (apartment) => {
    if (!user) {
      message.warning(t('apartments.loginToInterest'));
      return;
    }
    await createInterest(apartment.id, 'Khách hàng quan tâm căn hộ gần địa chỉ đăng ký.');
    message.success(t('apartments.interestSent'));
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
          <span>{t('home.badge')}</span>
          <h1>{t('home.title')}</h1>
          <p>{t('home.description')}</p>
          <HeroActions>
            <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
              <Link to="/apartments">{t('common.viewApartments')}</Link>
            </Button>
            <Button size="large">
              <Link to="/contact">{t('common.contact')}</Link>
            </Button>
          </HeroActions>
          <HeroMetrics>
            {heroStats.map((item) => (
              <HeroMetric key={item.labelKey}>
                {item.icon}
                <strong>{item.value}</strong>
                <span>{t(item.labelKey)}</span>
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
            <span>{t('home.aiToday')}</span>
            <h2>{t('home.riverTitle')}</h2>
            <p>{t('home.riverMeta')}</p>
            <div>
              <small>{t('home.matchScore')}</small>
              <strong>96%</strong>
            </div>
          </VisualCard>
          <VisualCard
            $compact
            initial={{ opacity: 0, y: 24, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.75, delay: 0.32, ease: 'easeOut' }}
          >
            <span>{t('home.mapStock')}</span>
            <h2>{t('home.nearbyCount')}</h2>
            <p>{t('home.nearbyMeta')}</p>
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
          eyebrow={t('home.nearbyEyebrow')}
          title={t('home.nearbyTitle')}
          description={t('home.nearbyDescription')}
        />
        <NearbyPanel>
          <div>
            <strong>
              {userLocation.districtLabel
                ? t('home.nearbyArea', { area: `${userLocation.ward ? `${userLocation.ward}, ` : ''}${userLocation.districtLabel}` })
                : t('home.nearbyUnknown')}
            </strong>
            <p>
              {user
                ? userLocation.districtLabel
                  ? t('home.nearbyAddress', { address: userLocation.fullAddress || t('nav.account') })
                  : t('home.nearbyUpdate')
                : t('home.nearbyGuest')}
            </p>
          </div>
          <Space wrap>
            {!user && <Button type="primary"><Link to="/login">{t('common.login')}</Link></Button>}
            <Button>
              <Link to={user ? '/account' : '/register'}>{user ? t('common.updateAddress') : t('common.registerAccount')}</Link>
            </Button>
            {userLocation.district && (
              <Button type="primary">
                <Link to={nearbyLink}>{t('home.viewNearMe')}</Link>
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
          <Empty description={user ? t('home.emptyNearbyUser') : t('home.emptyNearbyGuest')} />
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
          eyebrow={t('home.personalEyebrow')}
          title={t('home.personalTitle')}
          description={t('home.personalDescription')}
        />
        {loadingPersonal ? (
          <Spin size="large" />
        ) : user && personalRecommendations.length ? (
          <ApartmentGrid>
            {personalRecommendations.slice(0, 4).map((apartment, index) => (
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
          <Empty description={t('home.personalEmpty')}>
            <Button type="primary">
              <Link to={user ? '/apartments' : '/login'}>{user ? t('common.viewApartments') : t('common.login')}</Link>
            </Button>
          </Empty>
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
          eyebrow={t('home.featuresEyebrow')}
          title={t('home.featuresTitle')}
          description={t('home.featuresDescription')}
        />
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.titleKey}
              as={MotionLink}
              to={feature.to}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              {feature.icon}
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.descriptionKey)}</p>
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
            <span>{t('common.contact')}</span>
            <h2>{t('home.contactTitle')}</h2>
            <p>{t('home.contactDescription')}</p>
          </div>
          <Space wrap>
            <p><CustomerServiceOutlined /> 0900 000 000</p>
            <Button type="primary">
              <Link to="/contact">{t('common.sendConsultation')}</Link>
            </Button>
          </Space>
        </ContactCard>
      </Section>
    </HomeWrap>
  );
}
