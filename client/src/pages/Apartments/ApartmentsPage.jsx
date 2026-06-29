import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Card, Empty, Spin } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { ApartmentCard } from '../../components/ApartmentCard/ApartmentCard.jsx';
import { ApartmentFilters } from '../../components/ApartmentFilters/ApartmentFilters.jsx';
import { MapView } from '../../components/MapView/MapView.jsx';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader.jsx';
import {
  createInterest,
  getApartments,
  getCurrentUser,
  getFavorites,
  toggleFavorite
} from '../../services/apiClient.js';
import { ApartmentGrid, ContentGrid, HomeWrap, Section, StickyMap } from '../Home/styles.js';
import { AiPanel, PageHero } from './styles.js';

const defaultFilters = {
  district: undefined,
  ward: undefined,
  status: undefined,
  priceRange: [1, 7],
  bedrooms: undefined,
  minArea: undefined,
  sort: 'featured',
  onlyAvailable: false
};

export function ApartmentsPage() {
  const { message } = AntdApp.useApp();
  const [searchParams] = useSearchParams();
  const [apartments, setApartments] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const queryDistrict = searchParams.get('district') || undefined;
  const queryWard = searchParams.get('ward') || undefined;

  useEffect(() => {
    Promise.all([
      getApartments(),
      getCurrentUser().catch(() => null),
      getFavorites().catch(() => [])
    ]).then(([items, currentUser, favorites]) => {
      setApartments(items);
      setUser(currentUser);
      setFavoriteIds(favorites.map((apartment) => apartment.id));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (queryDistrict || queryWard) {
      setFilters((current) => ({ ...current, district: queryDistrict, ward: queryWard }));
    }
  }, [queryDistrict, queryWard]);

  const filteredApartments = useMemo(() => {
    const filtered = apartments.filter((apartment) => {
      const priceInBillions = apartment.price / 1000000000;
      const matchesDistrict = !filters.district || apartment.district === filters.district;
      const matchesWard = !filters.ward || apartment.ward === filters.ward;
      const matchesStatus = !filters.status || apartment.status === filters.status;
      const matchesPrice = priceInBillions >= filters.priceRange[0] && priceInBillions <= filters.priceRange[1];
      const matchesBedrooms = !filters.bedrooms || apartment.bedrooms >= filters.bedrooms;
      const matchesArea = !filters.minArea || apartment.area >= filters.minArea;
      const matchesAvailability = !filters.onlyAvailable || (apartment.availableUnits ?? 1) > 0;

      return matchesDistrict && matchesWard && matchesStatus && matchesPrice && matchesBedrooms && matchesArea && matchesAvailability;
    });

    return [...filtered].sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price;
      if (filters.sort === 'price-desc') return b.price - a.price;
      if (filters.sort === 'area-desc') return b.area - a.area;
      if (filters.sort === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
      return Number(b.featured) - Number(a.featured);
    });
  }, [apartments, filters]);

  const recommendation = useMemo(() => {
    const available = filteredApartments.filter((apartment) => (apartment.availableUnits ?? 1) > 0);
    return available.find((apartment) => apartment.featured) || available[0];
  }, [filteredApartments]);

  const updateFilters = (nextFilters) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
  };

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
    await createInterest(apartment.id, 'Khách hàng quan tâm căn hộ này từ danh mục.');
    message.success('Admin đã nhận được nhu cầu của bạn và sẽ liên hệ lại.');
  };

  return (
    <HomeWrap>
      <PageHero>
        <SectionHeader
          eyebrow="Danh mục căn hộ"
          title="Tìm căn hộ theo vị trí, ngân sách và trạng thái còn hàng"
          description="Bộ lọc được tách riêng khỏi trang chủ để khách hàng tập trung tìm kiếm, lưu căn hộ ưa thích và gửi nhu cầu cho admin."
        />
      </PageHero>

      <Section>
        <ApartmentFilters
          filters={filters}
          onChange={updateFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        {recommendation && (
          <AiPanel>
            <BulbOutlined />
            <div>
              <strong>AI gợi ý phù hợp nhất lúc này</strong>
              <p>
                {recommendation.title} tại {recommendation.districtLabel}, giá {recommendation.priceLabel},
                diện tích {recommendation.area} m2. Căn này còn hàng và khớp tốt với bộ lọc hiện tại.
              </p>
            </div>
            <Button type="primary" onClick={() => handleInterest(recommendation)}>
              Tôi thích căn này
            </Button>
          </AiPanel>
        )}

        <ContentGrid>
          <div>
            {loading ? (
              <Spin size="large" />
            ) : filteredApartments.length ? (
              <ApartmentGrid>
                {filteredApartments.map((apartment, index) => (
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
              <Empty description="Chưa có căn hộ phù hợp với bộ lọc này" />
            )}
          </div>
          <StickyMap>
            <Card>
              <MapView apartments={filteredApartments} />
            </Card>
          </StickyMap>
        </ContentGrid>
      </Section>
    </HomeWrap>
  );
}
