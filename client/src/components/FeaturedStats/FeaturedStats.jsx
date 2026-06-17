import { Statistic } from 'antd';
import { BarChartOutlined, HomeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { StatGrid, StatItem } from './styles.js';

export function FeaturedStats() {
  return (
    <StatGrid>
      <StatItem>
        <HomeOutlined />
        <Statistic title="Căn hộ đang hiển thị" value={128} suffix="+" />
      </StatItem>
      <StatItem>
        <BarChartOutlined />
        <Statistic title="Quận/phường hỗ trợ lọc" value={42} />
      </StatItem>
      <StatItem>
        <SafetyCertificateOutlined />
        <Statistic title="Tin đã xác thực" value={96} suffix="%" />
      </StatItem>
    </StatGrid>
  );
}
