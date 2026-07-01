import { Badge, Button, Card, Space, Tag } from 'antd';
import {
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  HomeOutlined,
  PictureOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { AvailabilityBar, CardBody, Image, MetaGrid, TitleRow } from './styles.js';

export function ApartmentCard({
  apartment,
  index = 0,
  favorited = false,
  compared = false,
  onCompare,
  onFavorite,
  onInterest
}) {
  const navigate = useNavigate();
  const { t } = usePreferences();
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
          <strong>{soldOut ? t('common.soldOut') : apartment.priceLabel}</strong>
        </TitleRow>
        <MetaGrid>
          <span><HomeOutlined /> {apartment.area} m2</span>
          <span>{apartment.bedrooms} {t('common.bedroomsShort')}</span>
          <span>{apartment.bathrooms} {t('common.bathroomsShort')}</span>
          <span>{apartment.rentLabel}</span>
        </MetaGrid>
        <AvailabilityBar $soldOut={soldOut}>
          <div>{soldOut ? t('common.soldOutUnits') : t('common.available', { count: apartment.availableUnits ?? 1 })}</div>
          <span>{soldOut ? t('common.adminLocked') : t('common.inventoryUpdated')}</span>
        </AvailabilityBar>
        <Space size={[8, 8]} wrap>
          {apartment.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" block icon={<PictureOutlined />} onClick={openDetail}>
            {t('common.viewDetail')}
          </Button>
          <Space.Compact block>
            <Button
              block
              type={compared ? 'primary' : 'default'}
              icon={<SwapOutlined />}
              onClick={() => onCompare?.(apartment)}
            >
              {compared ? t('common.compared') : t('common.compare')}
            </Button>
            <Button
              block
              icon={favorited ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => onFavorite?.(apartment)}
            >
              {t('common.favorite')}
            </Button>
            <Button block disabled={soldOut} onClick={() => onInterest?.(apartment)}>
              {soldOut ? t('common.soldOut') : t('common.likeThisApartment')}
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
        <Badge.Ribbon text={t('common.soldOut')} color="red">{content}</Badge.Ribbon>
      ) : apartment.featured ? (
        <Badge.Ribbon text={t('common.featured')} color="green">{content}</Badge.Ribbon>
      ) : content}
    </motion.article>
  );
}
