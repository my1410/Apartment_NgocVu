import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Card, Empty, Modal, Space, Spin, Table, Tag } from 'antd';
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
import { usePreferences } from '../../context/AppPreferences.jsx';
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
  const { t } = usePreferences();
  const [searchParams] = useSearchParams();
  const [apartments, setApartments] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
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

  const comparedApartments = useMemo(() => compareIds
    .map((id) => apartments.find((apartment) => apartment.id === id))
    .filter(Boolean), [apartments, compareIds]);

  const compareRows = useMemo(() => [
    { key: 'price', metric: 'Giá bán', getValue: (apartment) => apartment.priceLabel },
    { key: 'rent', metric: 'Giá thuê', getValue: (apartment) => apartment.rentLabel },
    { key: 'area', metric: 'Diện tích', getValue: (apartment) => `${apartment.area} m2` },
    { key: 'bedrooms', metric: 'Phòng ngủ', getValue: (apartment) => apartment.bedrooms },
    { key: 'bathrooms', metric: 'Phòng tắm', getValue: (apartment) => apartment.bathrooms },
    { key: 'district', metric: 'Khu vực', getValue: (apartment) => apartment.districtLabel },
    { key: 'status', metric: 'Trạng thái', getValue: (apartment) => apartment.status },
    {
      key: 'stock',
      metric: 'Tồn kho',
      getValue: (apartment) => ((apartment.availableUnits ?? 0) > 0 ? `Còn ${apartment.availableUnits}` : 'Đã hết')
    },
    { key: 'tags', metric: 'Điểm mạnh', getValue: (apartment) => apartment.tags?.slice(0, 3).join(', ') || '-' }
  ].map((row) => ({
    key: row.key,
    metric: row.metric,
    ...Object.fromEntries(comparedApartments.map((apartment) => [apartment.id, row.getValue(apartment)]))
  })), [comparedApartments]);

  const compareColumns = useMemo(() => [
    {
      title: 'Tiêu chí',
      dataIndex: 'metric',
      key: 'metric',
      fixed: 'left',
      width: 140
    },
    ...comparedApartments.map((apartment) => ({
      title: apartment.title,
      dataIndex: apartment.id,
      key: apartment.id,
      width: 220,
      render: (value) => value || '-'
    }))
  ], [comparedApartments]);

  const updateFilters = (nextFilters) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
  };

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
    await createInterest(apartment.id, 'Khách hàng quan tâm căn hộ này từ danh mục.');
    message.success(t('apartments.interestSent'));
  };

  const handleCompare = (apartment) => {
    setCompareIds((current) => {
      if (current.includes(apartment.id)) {
        return current.filter((id) => id !== apartment.id);
      }
      if (current.length >= 4) {
        message.warning(t('apartments.compareLimit'));
        return current;
      }
      return [...current, apartment.id];
    });
  };

  return (
    <HomeWrap>
      <PageHero>
        <SectionHeader
          eyebrow={t('apartments.eyebrow')}
          title={t('apartments.title')}
          description={t('apartments.description')}
        />
      </PageHero>

      <Section>
        <ApartmentFilters
          filters={filters}
          onChange={updateFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        <Card>
          <Space wrap align="center" size={12}>
            <Tag color="cyan">{t('apartments.compareSelected', { count: comparedApartments.length })}</Tag>
            <span>{t('apartments.compareHint')}</span>
            <Button
              type="primary"
              disabled={comparedApartments.length < 2}
              onClick={() => setCompareOpen(true)}
            >
              {t('apartments.openCompare')}
            </Button>
            <Button disabled={!comparedApartments.length} onClick={() => setCompareIds([])}>
              {t('apartments.clearCompare')}
            </Button>
          </Space>
        </Card>

        {recommendation && (
          <AiPanel>
            <BulbOutlined />
            <div>
              <strong>{t('apartments.aiTitle')}</strong>
              <p>
                {t('apartments.aiDescription', {
                  title: recommendation.title,
                  district: recommendation.districtLabel,
                  price: recommendation.priceLabel,
                  area: recommendation.area
                })}
              </p>
            </div>
            <Button type="primary" onClick={() => handleInterest(recommendation)}>
              {t('common.likeThisApartment')}
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
                    compared={compareIds.includes(apartment.id)}
                    onCompare={handleCompare}
                    onFavorite={handleFavorite}
                    onInterest={handleInterest}
                  />
                ))}
              </ApartmentGrid>
            ) : (
              <Empty description={t('apartments.empty')} />
            )}
          </div>
          <StickyMap>
            <Card>
              <MapView apartments={filteredApartments} />
            </Card>
          </StickyMap>
        </ContentGrid>
      </Section>

      <Modal
        title={t('apartments.compareTitle')}
        open={compareOpen}
        onCancel={() => setCompareOpen(false)}
        footer={null}
        width={1100}
      >
        <Table
          rowKey="key"
          columns={compareColumns}
          dataSource={compareRows}
          pagination={false}
          scroll={{ x: 760 }}
        />
      </Modal>
    </HomeWrap>
  );
}
