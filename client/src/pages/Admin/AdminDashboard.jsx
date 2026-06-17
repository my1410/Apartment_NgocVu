import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Table, Tag } from 'antd';
import { LogoutOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { daNangLocations } from '../../data/vietnamLocations.js';
import { createApartment, getApartments, getCurrentUser, getInterests, logout } from '../../services/apiClient.js';
import { AdminHeader, AdminPage, FormPanel, Toolbar } from './styles.js';

const defaultImage = 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80';

function formatPriceLabel(price) {
  const billions = Number(price || 0) / 1000000000;
  return `${Number.isInteger(billions) ? billions : billions.toFixed(2)} tỷ`;
}

function parseTags(value = '') {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AdminDashboard() {
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const selectedDistrict = Form.useWatch('district', form);
  const district = useMemo(
    () => daNangLocations.find((item) => item.value === selectedDistrict),
    [selectedDistrict]
  );

  const loadApartments = async () => {
    setLoading(true);
    const [items, leadItems] = await Promise.all([getApartments(), getInterests().catch(() => [])]);
    setApartments(items);
    setInterests(leadItems);
    setLoading(false);
  };

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        return loadApartments();
      })
      .catch(() => {
        message.warning('Bạn cần đăng nhập admin trước.');
        navigate('/login', { replace: true });
      })
      .finally(() => setAuthChecked(true));
  }, [message, navigate]);

  const handleSubmit = async (values) => {
    const districtMeta = daNangLocations.find((item) => item.value === values.district);
    const payload = {
      ...values,
      districtLabel: districtMeta?.label || values.district,
      priceLabel: formatPriceLabel(values.price),
      rentLabel: values.rentLabel || 'Liên hệ',
      featured: Boolean(values.featured),
      tags: parseTags(values.tags),
      highlights: parseTags(values.highlights),
      gallery: parseTags(values.gallery),
      image: values.image || defaultImage,
      availableUnits: values.availableUnits,
      description: values.description,
      coordinates: {
        lat: Number(values.lat),
        lng: Number(values.lng)
      }
    };

    delete payload.lat;
    delete payload.lng;

    setSaving(true);
    try {
      await createApartment(payload);
      message.success('Đã thêm căn hộ mới.');
      form.resetFields();
      await loadApartments();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể thêm căn hộ.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const columns = [
    {
      title: 'Căn hộ',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <strong>{title}</strong>
          <p>{record.address}</p>
        </div>
      )
    },
    {
      title: 'Khu vực',
      key: 'location',
      render: (_, record) => `${record.districtLabel} / ${record.ward}`
    },
    {
      title: 'Giá',
      dataIndex: 'priceLabel',
      key: 'priceLabel'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Đang bán' ? 'green' : 'blue'}>{status}</Tag>
    }
  ];

  const interestColumns = [
    {
      title: 'Khách hàng',
      key: 'user',
      render: (_, record) => (
        <div>
          <strong>{record.user?.name || record.user?.email}</strong>
          <p>{record.user?.email} - {record.user?.phone || 'Chưa có SĐT'}</p>
        </div>
      )
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      render: (_, record) => {
        const address = record.user?.address;
        return address ? [address.street, address.ward, address.district, address.city].filter(Boolean).join(', ') : 'Chưa có';
      }
    },
    {
      title: 'Căn hộ quan tâm',
      key: 'apartment',
      render: (_, record) => (
        <div>
          <strong>{record.apartment?.title}</strong>
          <p>{record.apartment?.address}</p>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'new' ? 'green' : 'blue'}>{status}</Tag>
    }
  ];

  if (!authChecked) {
    return <AdminPage>Đang kiểm tra phiên đăng nhập...</AdminPage>;
  }

  return (
    <AdminPage>
      <AdminHeader>
        <div>
          <span>Admin dashboard</span>
          <h1>Quản lý căn hộ</h1>
          <p>Xin chào {user?.name}. Bạn có thể thêm căn hộ mới và xem danh sách đang có trong MongoDB.</p>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={loadApartments}>
            Tải lại
          </Button>
          <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Space>
      </AdminHeader>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={9}>
          <FormPanel>
            <h2>Thêm căn hộ mới</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                status: 'Đang bán',
                type: 'Căn hộ cao cấp',
                bedrooms: 2,
                bathrooms: 2,
                area: 70,
                price: 2500000000,
                availableUnits: 1,
                lat: 16.0678,
                lng: 108.2208,
                image: defaultImage
              }}
            >
              <Form.Item name="title" label="Tên căn hộ" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: Căn hộ ven sông Hàn" />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="district" label="Quận" rules={[{ required: true }]}>
                    <Select
                      placeholder="Chọn quận"
                      options={daNangLocations.map((item) => ({ label: item.label, value: item.value }))}
                      onChange={() => form.setFieldValue('ward', undefined)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="ward" label="Phường" rules={[{ required: true }]}>
                    <Select
                      placeholder="Chọn phường"
                      disabled={!district}
                      options={(district?.wards || []).map((ward) => ({ label: ward, value: ward }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                <Input placeholder="Đường, phường, quận, Đà Nẵng" />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="price" label="Giá bán" rules={[{ required: true }]}>
                    <InputNumber min={0} step={100000000} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="rentLabel" label="Giá thuê">
                    <Input placeholder="18 triệu/tháng" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item name="area" label="m2" rules={[{ required: true }]}>
                    <InputNumber min={1} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="bedrooms" label="PN" rules={[{ required: true }]}>
                    <InputNumber min={0} max={10} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="bathrooms" label="WC" rules={[{ required: true }]}>
                    <InputNumber min={0} max={10} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item name="availableUnits" label="Còn" rules={[{ required: true }]}>
                    <InputNumber min={0} max={999} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                    <Select options={[
                      { label: 'Đang bán', value: 'Đang bán' },
                      { label: 'Cho thuê', value: 'Cho thuê' }
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="type" label="Loại căn hộ" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="lat" label="Latitude" rules={[{ required: true }]}>
                    <InputNumber step={0.0001} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lng" label="Longitude" rules={[{ required: true }]}>
                    <InputNumber step={0.0001} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="image" label="Ảnh URL">
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item name="gallery" label="Gallery ảnh">
                <Input.TextArea placeholder="Dán nhiều URL, ngăn cách bằng dấu phẩy" />
              </Form.Item>
              <Form.Item name="description" label="Giới thiệu căn hộ">
                <Input.TextArea rows={4} placeholder="Mô tả tiện ích, vị trí, pháp lý, đối tượng phù hợp..." />
              </Form.Item>
              <Form.Item name="tags" label="Tags">
                <Input placeholder="View sông, Trung tâm, Nội thất mới" />
              </Form.Item>
              <Form.Item name="highlights" label="Điểm nổi bật">
                <Input placeholder="Hồ bơi, Gym, Gần biển" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} loading={saving}>
                Thêm căn hộ
              </Button>
            </Form>
          </FormPanel>
        </Col>
        <Col xs={24} xl={15}>
          <Card
            title="Danh sách căn hộ"
            extra={<Link to="/">Xem ngoài website</Link>}
          >
            <Toolbar>
              <strong>{apartments.length}</strong>
              <span>căn hộ đang hiển thị</span>
            </Toolbar>
            <Table
              rowKey={(record) => record.id || record._id}
              columns={columns}
              dataSource={apartments}
              loading={loading}
              pagination={{ pageSize: 6 }}
              scroll={{ x: 860 }}
            />
          </Card>
          <Card title="Khách hàng quan tâm" style={{ marginTop: 24 }}>
            <Toolbar>
              <strong>{interests.length}</strong>
              <span>nhu cầu cần liên hệ</span>
            </Toolbar>
            <Table
              rowKey={(record) => record._id}
              columns={interestColumns}
              dataSource={interests}
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 900 }}
            />
          </Card>
        </Col>
      </Row>
    </AdminPage>
  );
}
