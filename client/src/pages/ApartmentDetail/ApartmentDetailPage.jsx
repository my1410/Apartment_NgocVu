import { useEffect, useState } from 'react';
import { App as AntdApp, Button, Carousel, Descriptions, Image, Space, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, HeartOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapView } from '../../components/MapView/MapView.jsx';
import { createInterest, getApartment, getCurrentUser, toggleFavorite } from '../../services/apiClient.js';
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
      message.warning('Bạn cần đăng nhập để dùng chức năng này.');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleFavorite = async () => {
    if (!requireUser()) return;
    await toggleFavorite(apartment.id);
    message.success('Đã cập nhật căn hộ ưa thích.');
  };

  const handleInterest = async () => {
    if (!requireUser()) return;
    await createInterest(apartment.id, 'Khách hàng quan tâm căn hộ từ trang chi tiết.');
    message.success('Admin đã nhận được nhu cầu của bạn và sẽ liên hệ lại.');
  };

  return (
    <DetailPage>
      <Button icon={<ArrowLeftOutlined />}>
        <Link to="/apartments">Quay lại danh mục</Link>
      </Button>

      <DetailHero $image={apartment.image}>
        <div>
          <Space wrap>
            <Tag color={soldOut ? 'red' : 'green'}>{soldOut ? 'Đã hết' : apartment.status}</Tag>
            <Tag>{apartment.type}</Tag>
            <Tag>{apartment.districtLabel}</Tag>
          </Space>
          <h1>{apartment.title}</h1>
          <p><EnvironmentOutlined /> {apartment.address}</p>
        </div>
      </DetailHero>

      <DetailGrid>
        <GlassPanel>
          <h2>Thông tin căn hộ</h2>
          <Descriptions column={{ xs: 1, md: 2 }} bordered>
            <Descriptions.Item label="Giá bán">{apartment.priceLabel}</Descriptions.Item>
            <Descriptions.Item label="Giá thuê">{apartment.rentLabel}</Descriptions.Item>
            <Descriptions.Item label="Diện tích">{apartment.area} m2</Descriptions.Item>
            <Descriptions.Item label="Phòng ngủ">{apartment.bedrooms}</Descriptions.Item>
            <Descriptions.Item label="Phòng tắm">{apartment.bathrooms}</Descriptions.Item>
            <Descriptions.Item label="Số lượng còn">{soldOut ? 'Đã hết' : apartment.availableUnits}</Descriptions.Item>
          </Descriptions>
          <p>{apartment.description}</p>
          <Space size={[8, 8]} wrap>
            {(apartment.highlights || apartment.tags || []).map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </Space>
          <Space wrap>
            <Button icon={<HeartOutlined />} onClick={handleFavorite}>
              Lưu căn hộ ưa thích
            </Button>
            <Button type="primary" size="large" icon={<PhoneOutlined />} disabled={soldOut} onClick={handleInterest}>
              {soldOut ? 'Căn hộ đã hết' : 'Tôi thích căn hộ này'}
            </Button>
          </Space>
        </GlassPanel>
        <MapView apartments={[apartment]} />
      </DetailGrid>

      <GlassPanel>
        <h2>Hình ảnh căn hộ</h2>
        <GalleryShell>
          <Carousel autoplay autoplaySpeed={3200} dots effect="fade">
            {galleryImages.map((image, index) => (
              <GallerySlide key={image}>
                <Image
                  src={image}
                  alt={`${apartment.title} - ảnh ${index + 1}`}
                  preview={false}
                />
                <div>
                  <span>{String(index + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}</span>
                  <strong>{apartment.title}</strong>
                  <p>Không gian căn hộ, tiện ích và phong cách sống hiện đại tại {apartment.districtLabel}.</p>
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
