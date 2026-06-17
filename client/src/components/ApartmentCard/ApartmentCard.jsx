import { Badge, Button, Card, Space, Tag } from 'antd';
import { EnvironmentOutlined, HeartFilled, HeartOutlined, HomeOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardBody, Image, MetaGrid, TitleRow } from './styles.js';

export function ApartmentCard({ apartment, index = 0, favorited = false, onFavorite, onInterest }) {
  const navigate = useNavigate();
  const soldOut = (apartment.availableUnits ?? 1) <= 0;
  const openDetail = () => {
    navigate(`/apartments/${apartment.id}`);
  };

  const content = (
    <Card
      hoverable
      cover={<Image src={apartment.image} alt={apartment.title} onClick={openDetail} />}
    >
      <CardBody>
        <TitleRow>
          <div>
            <button type="button" onClick={openDetail}>{apartment.title}</button>
            <p><EnvironmentOutlined /> {apartment.address}</p>
          </div>
          <strong>{soldOut ? 'Đã hết' : apartment.priceLabel}</strong>
        </TitleRow>
        <MetaGrid>
          <span><HomeOutlined /> {apartment.area} m2</span>
          <span>{apartment.bedrooms} PN</span>
          <span>{apartment.bathrooms} WC</span>
          <span>{apartment.rentLabel}</span>
        </MetaGrid>
        <Space size={[8, 8]} wrap>
          {apartment.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" block icon={<PictureOutlined />} onClick={openDetail}>
            Xem chi tiết
          </Button>
          <Space.Compact block>
            <Button
              block
              icon={favorited ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => onFavorite?.(apartment)}
            >
              Yêu thích
            </Button>
            <Button block disabled={soldOut} onClick={() => onInterest?.(apartment)}>
              {soldOut ? 'Đã hết' : 'Tôi thích căn này'}
            </Button>
          </Space.Compact>
        </Space>
      </CardBody>
    </Card>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
    >
      {soldOut ? (
        <Badge.Ribbon text="Đã hết" color="red">{content}</Badge.Ribbon>
      ) : apartment.featured ? (
        <Badge.Ribbon text="Nổi bật" color="green">{content}</Badge.Ribbon>
      ) : content}
    </motion.article>
  );
}
