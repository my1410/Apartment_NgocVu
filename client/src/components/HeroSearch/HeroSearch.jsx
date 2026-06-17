import { Button, Cascader } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { locationOptions } from '../../data/vietnamLocations.js';
import { HeroGrid, HeroPanel, HeroText, SearchBar, TrustPill } from './styles.js';

export function HeroSearch({ onLocationChange }) {
  return (
    <HeroGrid>
      <HeroText
        as={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <TrustPill>
          <EnvironmentOutlined /> Bất động sản căn hộ Đà Nẵng
        </TrustPill>
        <h1>Tìm căn hộ đúng khu vực, đúng ngân sách, đúng nhịp sống.</h1>
        <p>
          Nền tảng căn hộ hiện đại với bộ lọc theo quận, phường, mức giá, số phòng ngủ, bản đồ Google Map và trợ lý AI tư vấn nhanh.
        </p>
        <SearchBar>
          <Cascader
            options={locationOptions}
            placeholder="Chọn quận / phường, ví dụ Hải Châu"
            expandTrigger="hover"
            onChange={onLocationChange}
            size="large"
          />
          <Button type="primary" icon={<SearchOutlined />}>
            Tìm căn hộ
          </Button>
        </SearchBar>
      </HeroText>

      <HeroPanel
        as={motion.div}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
      >
        <div>
          <span>Giá từ</span>
          <strong>1.35 tỷ</strong>
        </div>
        <div>
          <span>Khu vực</span>
          <strong>6 quận</strong>
        </div>
        <div>
          <span>Cập nhật</span>
          <strong>Realtime</strong>
        </div>
      </HeroPanel>
    </HeroGrid>
  );
}
