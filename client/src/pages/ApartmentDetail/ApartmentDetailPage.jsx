import { useEffect, useState } from 'react';
import { App as AntdApp, Button, Carousel, Descriptions, Image, Space, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, HeartOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapView } from '../../components/MapView/MapView.jsx';
import { createInterest, getApartment, getCurrentUser, toggleFavorite } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { DetailGrid, DetailHero, DetailPage, GalleryShell, GallerySlide, GlassPanel, ThumbGrid } from './styles.js';

const galleryFallbacks = [
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85'
];

export function ApartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { t } = usePreferences();
  const [apartment, setApartment] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getApartment(id),
      getCurrentUser().catch(() => null)
    ]).then(([item, currentUser]) => {
      setApartment(item);
      setUser(currentUser);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <DetailPage><Spin size="large" /></DetailPage>;
  }

  const soldOut = (apartment.availableUnits ?? 1) <= 0;
  const galleryImages = Array.from(new Set([
    apartment.image,
    ...(apartment.gallery || []),
    ...galleryFallbacks
  ].filter(Boolean))).slice(0, 8);

  const requireUser = () => {
    if (!user) {
      message.warning(t('detail.loginRequired'));
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleFavorite = async () => {
    if (!requireUser()) return;
    await toggleFavorite(apartment.id);
    message.success(t('detail.favoriteUpdated'));
  };

  const handleInterest = async () => {
    if (!requireUser()) return;
    await createInterest(apartment.id, 'Khách hàng quan tâm căn hộ từ trang chi tiết.');
    message.success(t('detail.interestSent'));
  };

  const statusLabel = apartment.status === 'Đang bán'
    ? t('common.forSaleStatus')
    : apartment.status === 'Cho thuê'
      ? t('common.forRentStatus')
      : apartment.status;

  return (
    <DetailPage>
      <Button icon={<ArrowLeftOutlined />}>
        <Link to="/apartments">{t('common.backToApartments')}</Link>
      </Button>

      <DetailHero $image={apartment.image}>
        <div>
          <Space wrap>
            <Tag color={soldOut ? 'red' : 'green'}>{soldOut ? t('common.soldOut') : statusLabel}</Tag>
            <Tag>{apartment.type}</Tag>
            <Tag>{apartment.districtLabel}</Tag>
          </Space>
          <h1>{apartment.title}</h1>
          <p><EnvironmentOutlined /> {apartment.address}</p>
        </div>
      </DetailHero>

      <DetailGrid>
        <GlassPanel>
          <h2>{t('detail.infoTitle')}</h2>
          <Descriptions column={{ xs: 1, md: 2 }} bordered>
            <Descriptions.Item label={t('detail.salePrice')}>{apartment.priceLabel}</Descriptions.Item>
            <Descriptions.Item label={t('detail.rentPrice')}>{apartment.rentLabel}</Descriptions.Item>
            <Descriptions.Item label={t('detail.area')}>{apartment.area} m2</Descriptions.Item>
            <Descriptions.Item label={t('detail.bedrooms')}>{apartment.bedrooms}</Descriptions.Item>
            <Descriptions.Item label={t('detail.bathrooms')}>{apartment.bathrooms}</Descriptions.Item>
            <Descriptions.Item label={t('detail.availableUnits')}>
              {soldOut ? t('common.soldOut') : apartment.availableUnits}
            </Descriptions.Item>
          </Descriptions>
          <p>{apartment.description}</p>
          <Space size={[8, 8]} wrap>
            {(apartment.highlights || apartment.tags || []).map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </Space>
          <Space wrap>
            <Button icon={<HeartOutlined />} onClick={handleFavorite}>
              {t('detail.saveFavorite')}
            </Button>
            <Button type="primary" size="large" icon={<PhoneOutlined />} disabled={soldOut} onClick={handleInterest}>
              {soldOut ? t('detail.soldOutButton') : t('common.likeThisApartment')}
            </Button>
          </Space>
        </GlassPanel>
        <MapView apartments={[apartment]} />
      </DetailGrid>

      <GlassPanel>
        <h2>{t('detail.galleryTitle')}</h2>
        <GalleryShell>
          <Carousel autoplay autoplaySpeed={3200} dots effect="fade">
            {galleryImages.map((image, index) => (
              <GallerySlide key={image}>
                <Image
                  src={image}
                  alt={t('detail.galleryAlt', { title: apartment.title, index: index + 1 })}
                  preview={false}
                />
                <div>
                  <span>{String(index + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}</span>
                  <strong>{apartment.title}</strong>
                  <p>{t('detail.galleryText', { district: apartment.districtLabel })}</p>
                </div>
              </GallerySlide>
            ))}
          </Carousel>
        </GalleryShell>
        <ThumbGrid>
          {galleryImages.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={`${apartment.title} thumbnail ${index + 1}`}
            />
          ))}
        </ThumbGrid>
      </GlassPanel>
    </DetailPage>
  );
}
