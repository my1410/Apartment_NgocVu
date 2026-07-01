import { Button, Checkbox, Col, InputNumber, Row, Select, Slider } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { daNangLocations } from '../../data/vietnamLocations.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { FilterCard, FilterTitle } from './styles.js';

const priceMarksByLanguage = {
  vi: {
    1: '1 tỷ',
    3: '3 tỷ',
    5: '5 tỷ',
    7: '7+ tỷ'
  },
  en: {
    1: '1B',
    3: '3B',
    5: '5B',
    7: '7B+'
  }
};

export function ApartmentFilters({ filters, onChange, onReset }) {
  const { language, t } = usePreferences();
  const selectedDistrict = daNangLocations.find((district) => district.value === filters.district);
  const priceMarks = priceMarksByLanguage[language] || priceMarksByLanguage.vi;

  return (
    <FilterCard>
      <FilterTitle>
        <div>
          <span>{t('filters.badge')}</span>
          <h3>{t('filters.title')}</h3>
        </div>
        <Button icon={<ClearOutlined />} onClick={onReset}>
          {t('filters.reset')}
        </Button>
      </FilterTitle>

      <Row gutter={[16, 18]}>
        <Col xs={24} md={8}>
          <Select
            allowClear
            showSearch
            placeholder={t('filters.district')}
            value={filters.district}
            onChange={(district) => onChange({ district, ward: undefined })}
            options={daNangLocations.map((district) => ({ label: district.label, value: district.value }))}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            allowClear
            showSearch
            placeholder={t('filters.ward')}
            value={filters.ward}
            disabled={!selectedDistrict}
            onChange={(ward) => onChange({ ward })}
            options={(selectedDistrict?.wards || []).map((ward) => ({ label: ward, value: ward }))}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            allowClear
            placeholder={t('filters.status')}
            value={filters.status}
            onChange={(status) => onChange({ status })}
            options={[
              { label: t('filters.forSale'), value: 'Đang bán' },
              { label: t('filters.forRent'), value: 'Cho thuê' }
            ]}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder={t('filters.sort')}
            value={filters.sort}
            onChange={(sort) => onChange({ sort })}
            options={[
              { label: t('filters.featured'), value: 'featured' },
              { label: t('filters.newest'), value: 'newest' },
              { label: t('filters.priceAsc'), value: 'price-asc' },
              { label: t('filters.priceDesc'), value: 'price-desc' },
              { label: t('filters.areaDesc'), value: 'area-desc' }
            ]}
          />
        </Col>
        <Col xs={24} md={16}>
          <label>{t('filters.priceRange', { from: filters.priceRange[0], to: filters.priceRange[1] })}</label>
          <Slider
            range
            min={1}
            max={7}
            step={0.25}
            marks={priceMarks}
            value={filters.priceRange}
            onChange={(priceRange) => onChange({ priceRange })}
          />
        </Col>
        <Col xs={24} md={4}>
          <label>{t('filters.bedrooms')}</label>
          <InputNumber
            min={1}
            max={5}
            value={filters.bedrooms}
            onChange={(bedrooms) => onChange({ bedrooms })}
            placeholder={t('filters.min')}
          />
        </Col>
        <Col xs={24} md={4}>
          <label>{t('filters.minArea')}</label>
          <InputNumber
            min={30}
            max={250}
            value={filters.minArea}
            onChange={(minArea) => onChange({ minArea })}
            placeholder="m2"
          />
        </Col>
        <Col xs={24} md={8}>
          <Checkbox
            checked={filters.onlyAvailable}
            onChange={(event) => onChange({ onlyAvailable: event.target.checked })}
          >
            {t('filters.onlyAvailable')}
          </Checkbox>
        </Col>
      </Row>
    </FilterCard>
  );
}
