import { Button, Card, Col, Row, Space } from 'antd';
import { ArrowRightOutlined, CustomerServiceOutlined, EnvironmentOutlined, HeartOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FeaturedStats } from '../../components/FeaturedStats/FeaturedStats.jsx';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader.jsx';
import { FeatureCard, HeroActions, HomeHero, HomeWrap, Section } from './styles.js';

export function HomePage() {
  return (
    <HomeWrap>
      <HomeHero>
        <span>DN Apartment Hub</span>
        <h1>Đối tác tìm căn hộ hiện đại tại Đà Nẵng.</h1>
        <p>
          Chúng tôi kết nối khách hàng với căn hộ đã chọn lọc theo vị trí, pháp lý, ngân sách,
          bản đồ và nhu cầu sống thực tế. Tất cả được tối ưu bằng dữ liệu, AI gợi ý và đội ngũ tư vấn địa phương.
        </p>
        <HeroActions>
          <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
            <Link to="/apartments">Xem danh mục căn hộ</Link>
          </Button>
          <Button size="large">
            <Link to="/contact">Liên hệ tư vấn</Link>
          </Button>
        </HeroActions>
      </HomeHero>

      <FeaturedStats />

      <Section>
        <SectionHeader
          eyebrow="Tính năng nổi bật"
          title="Một nền tảng căn hộ gọn, nhanh và có dữ liệu rõ ràng"
          description="Tìm theo quận/phường, xem vị trí trên map, lưu căn hộ yêu thích và gửi nhu cầu để tư vấn viên liên hệ."
        />
        <Row gutter={[18, 18]}>
          <Col xs={24} md={8}>
            <FeatureCard as={Link} to="/apartments">
              <EnvironmentOutlined />
              <h3>Lọc theo khu vực</h3>
              <p>Chọn Hải Châu, Sơn Trà, Ngũ Hành Sơn hoặc từng phường để xem đúng căn hộ trong khu vực.</p>
            </FeatureCard>
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard as={Link} to="/favorites">
              <HeartOutlined />
              <h3>Căn hộ ưa thích</h3>
              <p>Lưu căn hộ bạn quan tâm, gửi tín hiệu cho admin và nhận tư vấn dựa trên nhu cầu thật.</p>
            </FeatureCard>
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard as={Link} to="/account">
              <SafetyCertificateOutlined />
              <h3>Bảo mật tài khoản</h3>
              <p>Đăng ký bằng email, số điện thoại, địa chỉ; có xác nhận email và cookie HTTP-only.</p>
            </FeatureCard>
          </Col>
        </Row>
      </Section>

      <Section id="contact">
        <Card>
          <Space direction="vertical" size={14}>
            <SectionHeader
              eyebrow="Liên hệ"
              title="Cần tư vấn căn hộ phù hợp?"
              description="Để lại căn hộ yêu thích trong danh mục, admin sẽ thấy nhu cầu và liên hệ lại theo thông tin tài khoản của bạn."
            />
            <p><CustomerServiceOutlined /> Hotline: 0900 000 000</p>
            <p>Email: support@dnapartmenthub.vn</p>
            <Button type="primary">
              <Link to="/contact">Gửi yêu cầu tư vấn</Link>
            </Button>
          </Space>
        </Card>
      </Section>
    </HomeWrap>
  );
}
