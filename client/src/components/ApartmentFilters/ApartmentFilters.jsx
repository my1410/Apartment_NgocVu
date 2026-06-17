import { Button, Checkbox, Col, InputNumber, Row, Select, Slider } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { daNangLocations } from '../../data/vietnamLocations.js';
import { FilterCard, FilterTitle } from './styles.js';

const priceMarks = {
  1: '1 tỷ',
  3: '3 tỷ',
  5: '5 tỷ',
  7: '7+ tỷ'
};

export function ApartmentFilters({ filters, onChange, onReset }) {
  const selectedDistrict = daNangLocations.find((district) => district.value === filters.district);

  return (
    <FilterCard>
      <FilterTitle>
        <div>
          <span>Bộ lọc thông minh</span>
          <h3>Lọc theo khu vực địa lý và nhu cầu</h3>
        </div>
        <Button icon={<ClearOutlined />} onClick={onReset}>
          Xóa lọc
        </Button>
      </FilterTitle>

      <Row gutter={[16, 18]}>
        <Col xs={24} md={8}>
          <Select
            allowClear
            showSearch
            placeholder="Quận"
            value={filters.district}
            onChange={(district) => onChange({ district, ward: undefined })}
            options={daNangLocations.map((district) => ({ label: district.label, value: district.value }))}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            allowClear
            showSearch
            placeholder="Phường"
            value={filters.ward}
            disabled={!selectedDistrict}
            onChange={(ward) => onChange({ ward })}
            options={(selectedDistrict?.wards || []).map((ward) => ({ label: ward, value: ward }))}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            allowClear
            placeholder="Trạng thái"
            value={filters.status}
            onChange={(status) => onChange({ status })}
            options={[
              { label: 'Đang bán', value: 'Đang bán' },
              { label: 'Cho thuê', value: 'Cho thuê' }
            ]}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder="Sắp xếp"
            value={filters.sort}
            onChange={(sort) => onChange({ sort })}
            options={[
              { label: 'Nổi bật trước', value: 'featured' },
              { label: 'Mới nhất', value: 'newest' },
              { label: 'Giá thấp đến cao', value: 'price-asc' },
              { label: 'Giá cao đến thấp', value: 'price-desc' },
              { label: 'Diện tích lớn trước', value: 'area-desc' }
            ]}
          />
        </Col>
        <Col xs={24} md={16}>
          <label>Mức giá: {filters.priceRange[0]} - {filters.priceRange[1]} tỷ</label>
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
          <label>Số phòng ngủ</label>
          <InputNumber
            min={1}
            max={5}
            value={filters.bedrooms}
            onChange={(bedrooms) => onChange({ bedrooms })}
            placeholder="Tối thiểu"
          />
        </Col>
        <Col xs={24} md={4}>
          <label>Diện tích tối thiểu</label>
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
            Chỉ hiện căn còn hàng
          </Checkbox>
        </Col>
      </Row>
    </FilterCard>
  );
}
