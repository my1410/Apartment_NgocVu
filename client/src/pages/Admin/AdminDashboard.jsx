import { useEffect, useMemo, useState } from 'react';
import {
  App as AntdApp,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip
} from 'antd';
import {
  BarChartOutlined,
  CalendarOutlined,
  ContactsOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FireOutlined,
  HomeOutlined,
  LogoutOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { daNangLocations } from '../../data/vietnamLocations.js';
import {
  createApartment,
  deleteApartment,
  getApartmentAnalytics,
  getApartments,
  getContactRequests,
  getCurrentUser,
  getInterests,
  getViewingAppointments,
  logout,
  updateApartment,
  updateContactRequest,
  updateInterest,
  updateViewingAppointment
} from '../../services/apiClient.js';
import {
  AdminHeader,
  AdminPage,
  FilterBar,
  FormPanel,
  KpiGrid,
  ManagementGrid,
  PanelTitle,
  TableCard,
  Toolbar
} from './styles.js';

const defaultImage = 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80';

const apartmentInitialValues = {
  status: 'Đang bán',
  type: 'Căn hộ cao cấp',
  bedrooms: 2,
  bathrooms: 2,
  area: 70,
  price: 2500000000,
  availableUnits: 1,
  featured: false,
  lat: 16.0678,
  lng: 108.2208,
  image: defaultImage
};

const leadStatusOptions = [
  { label: 'Mới', value: 'new' },
  { label: 'Đã liên hệ', value: 'contacted' },
  { label: 'Đã chốt', value: 'closed' }
];

const viewingStatusOptions = [
  { label: 'Mới gửi', value: 'new' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đã xem', value: 'visited' },
  { label: 'Đã hủy', value: 'cancelled' }
];

function formatPriceLabel(price) {
  const billions = Number(price || 0) / 1000000000;
  return `${Number.isInteger(billions) ? billions : billions.toFixed(2)} tỷ`;
}

function parseTags(value = '') {
  if (Array.isArray(value)) return value;
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stringifyTags(tags = []) {
  return Array.isArray(tags) ? tags.join(', ') : tags || '';
}

function getApartmentId(apartment) {
  return apartment.id || apartment._id;
}

function serializeApartment(values) {
  const districtMeta = daNangLocations.find((item) => item.value === values.district);
  const payload = {
    ...values,
    districtLabel: districtMeta?.label || values.district,
    price: Number(values.price),
    priceLabel: formatPriceLabel(values.price),
    rentLabel: values.rentLabel || 'Liên hệ',
    featured: Boolean(values.featured),
    tags: parseTags(values.tags),
    highlights: parseTags(values.highlights),
    gallery: parseTags(values.gallery),
    image: values.image || defaultImage,
    availableUnits: Number(values.availableUnits ?? 0),
    coordinates: {
      lat: Number(values.lat),
      lng: Number(values.lng)
    }
  };

  delete payload.lat;
  delete payload.lng;
  return payload;
}

function apartmentToFormValues(apartment) {
  return {
    ...apartment,
    tags: stringifyTags(apartment.tags),
    highlights: stringifyTags(apartment.highlights),
    gallery: stringifyTags(apartment.gallery),
    lat: apartment.coordinates?.lat,
    lng: apartment.coordinates?.lng,
    featured: Boolean(apartment.featured)
  };
}

function ApartmentFormFields({ form }) {
  const selectedDistrict = Form.useWatch('district', form);
  const district = useMemo(
    () => daNangLocations.find((item) => item.value === selectedDistrict),
    [selectedDistrict]
  );

  return (
    <>
      <Form.Item name="title" label="Tên căn hộ" rules={[{ required: true, message: 'Nhập tên căn hộ.' }]}>
        <Input placeholder="Ví dụ: Căn hộ ven sông Hàn" />
      </Form.Item>
      <Row gutter={12}>
        <Col xs={24} md={12}>
          <Form.Item name="district" label="Quận" rules={[{ required: true, message: 'Chọn quận.' }]}>
            <Select
              placeholder="Chọn quận"
              options={daNangLocations.map((item) => ({ label: item.label, value: item.value }))}
              onChange={() => form.setFieldValue('ward', undefined)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="ward" label="Phường" rules={[{ required: true, message: 'Chọn phường.' }]}>
            <Select
              placeholder="Chọn phường"
              disabled={!district}
              options={(district?.wards || []).map((ward) => ({ label: ward, value: ward }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ.' }]}>
        <Input placeholder="Đường, phường, quận, Đà Nẵng" />
      </Form.Item>
      <Row gutter={12}>
        <Col xs={24} md={12}>
          <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: 'Nhập giá bán.' }]}>
            <InputNumber min={0} step={100000000} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="rentLabel" label="Giá thuê">
            <Input placeholder="18 triệu/tháng" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col xs={8}>
          <Form.Item name="area" label="m2" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item name="bedrooms" label="PN" rules={[{ required: true }]}>
            <InputNumber min={0} max={10} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item name="bathrooms" label="WC" rules={[{ required: true }]}>
            <InputNumber min={0} max={10} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col xs={24} md={8}>
          <Form.Item name="availableUnits" label="Số lượng còn" rules={[{ required: true }]}>
            <InputNumber min={0} max={999} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select options={[
              { label: 'Đang bán', value: 'Đang bán' },
              { label: 'Cho thuê', value: 'Cho thuê' }
            ]} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="featured" label="Nổi bật">
            <Select options={[
              { label: 'Có', value: true },
              { label: 'Không', value: false }
            ]} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="type" label="Loại căn hộ" rules={[{ required: true }]}>
        <Input placeholder="Căn hộ cao cấp, studio, căn hộ vừa túi tiền..." />
      </Form.Item>
      <Row gutter={12}>
        <Col xs={24} md={12}>
          <Form.Item name="lat" label="Latitude" rules={[{ required: true }]}>
            <InputNumber step={0.0001} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="lng" label="Longitude" rules={[{ required: true }]}>
            <InputNumber step={0.0001} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="image" label="Ảnh đại diện URL">
        <Input placeholder="https://..." />
      </Form.Item>
      <Form.Item name="gallery" label="Gallery ảnh">
        <Input.TextArea rows={2} placeholder="Dán nhiều URL, ngăn cách bằng dấu phẩy" />
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
    </>
  );
}

export function AdminDashboard() {
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [interests, setInterests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [viewings, setViewings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [leadFilter, setLeadFilter] = useState('all');
  const [contactFilter, setContactFilter] = useState('all');
  const [viewingFilter, setViewingFilter] = useState('all');
  const [authChecked, setAuthChecked] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    const [items, leadItems, contactItems, viewingItems, analyticsData] = await Promise.all([
      getApartments(),
      getInterests().catch(() => []),
      getContactRequests().catch(() => []),
      getViewingAppointments().catch(() => []),
      getApartmentAnalytics().catch(() => null)
    ]);
    setApartments(items);
    setInterests(leadItems);
    setContacts(contactItems);
    setViewings(viewingItems);
    setAnalytics(analyticsData);
    setLoading(false);
  };

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        return loadDashboard();
      })
      .catch(() => {
        message.warning('Bạn cần đăng nhập admin trước.');
        navigate('/login', { replace: true });
      })
      .finally(() => setAuthChecked(true));
  }, [message, navigate]);

  const stats = useMemo(() => {
    const availableUnits = apartments.reduce((sum, apartment) => sum + Number(apartment.availableUnits || 0), 0);
    const soldOut = apartments.filter((apartment) => (apartment.availableUnits ?? 0) <= 0).length;
    const featured = apartments.filter((apartment) => apartment.featured).length;
    const newLeads = interests.filter((interest) => interest.status === 'new').length;
    const newContacts = contacts.filter((contact) => contact.status === 'new').length;
    const newViewings = viewings.filter((viewing) => viewing.status === 'new').length;
    const totalValue = apartments.reduce((sum, apartment) => sum + Number(apartment.price || 0), 0);
    const totalViews = analytics?.conversion?.views || 0;

    return {
      total: apartments.length,
      availableUnits,
      soldOut,
      featured,
      newLeads,
      newContacts,
      newViewings,
      totalViews,
      totalValue: `${(totalValue / 1000000000).toFixed(1)} tỷ`
    };
  }, [apartments, interests, contacts, viewings, analytics]);

  const filteredApartments = useMemo(() => apartments.filter((apartment) => {
    const searchText = `${apartment.title} ${apartment.address} ${apartment.districtLabel} ${apartment.ward}`.toLowerCase();
    const matchesKeyword = !keyword || searchText.includes(keyword.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apartment.status === statusFilter;
    const matchesStock = stockFilter === 'all'
      || (stockFilter === 'available' && (apartment.availableUnits ?? 0) > 0)
      || (stockFilter === 'soldOut' && (apartment.availableUnits ?? 0) <= 0)
      || (stockFilter === 'featured' && apartment.featured);

    return matchesKeyword && matchesStatus && matchesStock;
  }), [apartments, keyword, statusFilter, stockFilter]);

  const filteredInterests = useMemo(() => interests.filter((interest) => (
    leadFilter === 'all' || interest.status === leadFilter
  )), [interests, leadFilter]);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contactFilter === 'all' || contact.status === contactFilter
  )), [contacts, contactFilter]);

  const filteredViewings = useMemo(() => viewings.filter((viewing) => (
    viewingFilter === 'all' || viewing.status === viewingFilter
  )), [viewings, viewingFilter]);

  const handleCreateApartment = async (values) => {
    setSaving(true);
    try {
      await createApartment(serializeApartment(values));
      message.success('Đã thêm căn hộ mới.');
      createForm.resetFields();
      await loadDashboard();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể thêm căn hộ.');
    } finally {
      setSaving(false);
    }
  };

  const openEditApartment = (apartment) => {
    setEditingApartment(apartment);
    editForm.setFieldsValue(apartmentToFormValues(apartment));
  };

  const closeEditApartment = () => {
    setEditingApartment(null);
    editForm.resetFields();
  };

  const handleUpdateApartment = async (values) => {
    if (!editingApartment) return;

    setSaving(true);
    try {
      const updatedApartment = await updateApartment(getApartmentId(editingApartment), serializeApartment(values));
      setApartments((current) => current.map((apartment) => (
        getApartmentId(apartment) === getApartmentId(updatedApartment) ? updatedApartment : apartment
      )));
      message.success('Đã cập nhật căn hộ.');
      closeEditApartment();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể cập nhật căn hộ.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStock = async (apartment, availableUnits) => {
    const updatedApartment = await updateApartment(getApartmentId(apartment), {
      availableUnits,
      status: apartment.status
    });
    setApartments((current) => current.map((item) => (
      getApartmentId(item) === getApartmentId(updatedApartment) ? updatedApartment : item
    )));
    message.success(availableUnits <= 0 ? 'Đã chuyển căn hộ sang Đã hết.' : 'Đã cập nhật số lượng.');
  };

  const handleDeleteApartment = async (apartment) => {
    await deleteApartment(getApartmentId(apartment));
    setApartments((current) => current.filter((item) => getApartmentId(item) !== getApartmentId(apartment)));
    setInterests((current) => current.filter((interest) => interest.apartment?._id !== getApartmentId(apartment)));
    message.success('Đã xoá căn hộ và lead liên quan.');
  };

  const handleLeadStatus = async (interest, status) => {
    const updatedInterest = await updateInterest(interest._id, { status });
    setInterests((current) => current.map((item) => (item._id === updatedInterest._id ? updatedInterest : item)));
    message.success('Đã cập nhật trạng thái khách hàng.');
  };

  const handleContactStatus = async (contact, status) => {
    const updatedContact = await updateContactRequest(contact.id || contact._id, { status });
    setContacts((current) => current.map((item) => (
      (item.id || item._id) === (updatedContact.id || updatedContact._id) ? updatedContact : item
    )));
    message.success('Đã cập nhật yêu cầu liên hệ.');
  };

  const handleViewingStatus = async (viewing, status) => {
    const updatedViewing = await updateViewingAppointment(viewing.id || viewing._id, { status });
    setViewings((current) => current.map((item) => (
      (item.id || item._id) === (updatedViewing.id || updatedViewing._id) ? updatedViewing : item
    )));
    message.success('Đã cập nhật lịch xem căn hộ.');
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
      fixed: 'left',
      width: 320,
      render: (title, record) => (
        <Space>
          <img src={record.image} alt={title} width={72} height={54} style={{ borderRadius: 14, objectFit: 'cover' }} />
          <div>
            <strong>{title}</strong>
            <p>{record.address}</p>
            <Space size={[4, 4]} wrap>
              {record.featured && <Tag color="gold">Nổi bật</Tag>}
              <Tag>{record.type}</Tag>
            </Space>
          </div>
        </Space>
      )
    },
    {
      title: 'Khu vực',
      key: 'location',
      width: 180,
      render: (_, record) => `${record.districtLabel} / ${record.ward}`
    },
    {
      title: 'Giá',
      dataIndex: 'priceLabel',
      key: 'priceLabel',
      width: 120
    },
    {
      title: 'Thông số',
      key: 'meta',
      width: 160,
      render: (_, record) => `${record.area}m2 - ${record.bedrooms}PN - ${record.bathrooms}WC`
    },
    {
      title: 'Kho',
      dataIndex: 'availableUnits',
      key: 'availableUnits',
      width: 120,
      render: (availableUnits) => {
        const units = availableUnits ?? 0;
        return units > 0
          ? <Tag color="green">Còn {units}</Tag>
          : <Tag color="red">Đã hết</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <Tag color={status === 'Đang bán' ? 'green' : 'blue'}>{status}</Tag>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 260,
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="Xem trên website">
            <Button icon={<EyeOutlined />}>
              <Link to={`/apartments/${getApartmentId(record)}`}>Xem</Link>
            </Button>
          </Tooltip>
          <Button icon={<EditOutlined />} onClick={() => openEditApartment(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Chuyển căn hộ này thành hết số lượng?"
            okText="Đồng ý"
            cancelText="Hủy"
            onConfirm={() => handleQuickStock(record, 0)}
          >
            <Button icon={<WarningOutlined />}>Hết</Button>
          </Popconfirm>
          <Popconfirm
            title="Xoá căn hộ này khỏi hệ thống?"
            description="Lead liên quan cũng sẽ được xoá."
            okText="Xoá"
            cancelText="Hủy"
            onConfirm={() => handleDeleteApartment(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const interestColumns = [
    {
      title: 'Khách hàng',
      key: 'user',
      width: 260,
      render: (_, record) => (
        <div>
          <strong>{record.user?.name || record.user?.email}</strong>
          <p>{record.user?.email}</p>
          <Space size={[6, 6]} wrap>
            {record.user?.phone && <Button size="small" href={`tel:${record.user.phone}`}>Gọi</Button>}
            {record.user?.email && <Button size="small" href={`mailto:${record.user.email}`}>Email</Button>}
            {record.user?.emailVerified && <Tag color="green">Đã xác thực</Tag>}
          </Space>
        </div>
      )
    },
    {
      title: 'Địa chỉ khách',
      key: 'address',
      width: 260,
      render: (_, record) => {
        const address = record.user?.address;
        return address ? [address.street, address.ward, address.district, address.city].filter(Boolean).join(', ') : 'Chưa có';
      }
    },
    {
      title: 'Căn hộ quan tâm',
      key: 'apartment',
      width: 300,
      render: (_, record) => (
        <div>
          <strong>{record.apartment?.title}</strong>
          <p>{record.apartment?.address}</p>
          <Tag>{record.apartment?.priceLabel}</Tag>
        </div>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 240,
      render: (note) => note || 'Chưa có ghi chú'
    },
    {
      title: 'Trạng thái CRM',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      width: 190,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          options={leadStatusOptions}
          onChange={(nextStatus) => handleLeadStatus(record, nextStatus)}
        />
      )
    }
  ];

  const contactColumns = [
    {
      title: 'Khách liên hệ',
      key: 'customer',
      width: 260,
      render: (_, record) => (
        <div>
          <strong>{record.name}</strong>
          <p>{record.email}</p>
          <Space size={[6, 6]} wrap>
            {record.phone && <Button size="small" href={`tel:${record.phone}`}>Gọi</Button>}
            <Button size="small" href={`mailto:${record.email}`}>Email</Button>
          </Space>
        </div>
      )
    },
    {
      title: 'Nhu cầu',
      key: 'need',
      width: 260,
      render: (_, record) => (
        <div>
          <Tag>{record.district || 'Chưa chọn khu vực'}</Tag>
          <p>{record.budget || 'Chưa có ngân sách'}</p>
        </div>
      )
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      key: 'message',
      width: 360
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      width: 190,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          options={leadStatusOptions}
          onChange={(nextStatus) => handleContactStatus(record, nextStatus)}
        />
      )
    }
  ];

  const viewingColumns = [
    {
      title: 'Khách đặt lịch',
      key: 'customer',
      width: 260,
      render: (_, record) => (
        <div>
          <strong>{record.user?.name || record.user?.email}</strong>
          <p>{record.user?.email}</p>
          <Space size={[6, 6]} wrap>
            {record.user?.phone && <Button size="small" href={`tel:${record.user.phone}`}>Gọi</Button>}
            {record.user?.email && <Button size="small" href={`mailto:${record.user.email}`}>Email</Button>}
          </Space>
        </div>
      )
    },
    {
      title: 'Căn hộ',
      key: 'apartment',
      width: 300,
      render: (_, record) => (
        <div>
          <strong>{record.apartment?.title}</strong>
          <p>{record.apartment?.address}</p>
          <Tag>{record.apartment?.priceLabel}</Tag>
        </div>
      )
    },
    {
      title: 'Thời gian xem',
      dataIndex: 'preferredAt',
      key: 'preferredAt',
      width: 190,
      render: (preferredAt) => new Date(preferredAt).toLocaleString('vi-VN')
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 260,
      render: (note) => note || 'Khách chưa ghi chú'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      width: 190,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          options={viewingStatusOptions}
          onChange={(nextStatus) => handleViewingStatus(record, nextStatus)}
        />
      )
    }
  ];

  if (!authChecked) {
    return <AdminPage>Đang kiểm tra phiên đăng nhập...</AdminPage>;
  }

  return (
    <AdminPage>
      <AdminHeader>
        <div>
          <span>Admin command center</span>
          <h1>Quản trị căn hộ & khách hàng</h1>
          <p>
            Xin chào {user?.name}. Đây là khu điều hành tồn kho, căn hộ nổi bật, lead khách hàng,
            trạng thái bán/thuê và dữ liệu hiển thị ngoài website.
          </p>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={loadDashboard}>
            Đồng bộ dữ liệu
          </Button>
          <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Space>
      </AdminHeader>

      <KpiGrid>
        <Card>
          <Statistic title="Tổng căn hộ" value={stats.total} prefix={<HomeOutlined />} />
        </Card>
        <Card>
          <Statistic title="Tổng số lượng còn" value={stats.availableUnits} prefix={<FireOutlined />} />
        </Card>
        <Card>
          <Statistic title="Căn đã hết" value={stats.soldOut} prefix={<WarningOutlined />} />
        </Card>
        <Card>
          <Statistic title="Lead mới" value={stats.newLeads} prefix={<TeamOutlined />} />
        </Card>
        <Card>
          <Statistic title="Liên hệ mới" value={stats.newContacts} prefix={<ContactsOutlined />} />
        </Card>
        <Card>
          <Statistic title="Lịch xem mới" value={stats.newViewings} prefix={<CalendarOutlined />} />
        </Card>
        <Card>
          <Statistic title="Lượt xem căn hộ" value={stats.totalViews} prefix={<BarChartOutlined />} />
        </Card>
        <Card>
          <Statistic title="Tổng giá trị rao bán" value={stats.totalValue} />
        </Card>
      </KpiGrid>

      <ManagementGrid>
        <FormPanel>
          <PanelTitle>
            <span>Tạo dữ liệu mới</span>
            <h2>Thêm căn hộ</h2>
            <p>Form đầy đủ cho ảnh, gallery, tọa độ bản đồ, tags, điểm nổi bật và tồn kho.</p>
          </PanelTitle>
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateApartment}
            initialValues={apartmentInitialValues}
          >
            <ApartmentFormFields form={createForm} />
            <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} loading={saving}>
              Thêm căn hộ vào hệ thống
            </Button>
          </Form>
        </FormPanel>

        <div>
          <TableCard
            title="Quản lý căn hộ"
            extra={<Link to="/apartments">Xem danh mục public</Link>}
          >
            <FilterBar>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Tìm theo tên, địa chỉ, khu vực..."
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'Tất cả trạng thái', value: 'all' },
                  { label: 'Đang bán', value: 'Đang bán' },
                  { label: 'Cho thuê', value: 'Cho thuê' }
                ]}
              />
              <Select
                value={stockFilter}
                onChange={setStockFilter}
                options={[
                  { label: 'Tất cả tồn kho', value: 'all' },
                  { label: 'Còn hàng', value: 'available' },
                  { label: 'Đã hết', value: 'soldOut' },
                  { label: 'Nổi bật', value: 'featured' }
                ]}
              />
            </FilterBar>
            <Toolbar>
              <strong>{filteredApartments.length}</strong>
              <span>căn hộ phù hợp bộ lọc quản trị</span>
            </Toolbar>
            <Table
              rowKey={(record) => getApartmentId(record)}
              columns={columns}
              dataSource={filteredApartments}
              loading={loading}
              pagination={{ pageSize: 6 }}
              scroll={{ x: 1400 }}
              locale={{ emptyText: <Empty description="Chưa có căn hộ phù hợp" /> }}
            />
          </TableCard>

          <TableCard title="CRM khách hàng quan tâm">
            <FilterBar>
              <Select
                value={leadFilter}
                onChange={setLeadFilter}
                options={[
                  { label: 'Tất cả lead', value: 'all' },
                  ...leadStatusOptions
                ]}
              />
            </FilterBar>
            <Toolbar>
              <strong>{filteredInterests.length}</strong>
              <span>nhu cầu cần theo dõi</span>
            </Toolbar>
            <Table
              rowKey={(record) => record._id}
              columns={interestColumns}
              dataSource={filteredInterests}
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1250 }}
              rowClassName={(record) => `lead-${record.status}`}
              locale={{ emptyText: <Empty description="Chưa có khách quan tâm" /> }}
            />
          </TableCard>

          <TableCard title="Lịch xem căn hộ">
            <FilterBar>
              <Select
                value={viewingFilter}
                onChange={setViewingFilter}
                options={[
                  { label: 'Tất cả lịch xem', value: 'all' },
                  ...viewingStatusOptions
                ]}
              />
            </FilterBar>
            <Toolbar>
              <strong>{filteredViewings.length}</strong>
              <span>lịch xem cần điều phối</span>
            </Toolbar>
            <Table
              rowKey={(record) => record.id || record._id}
              columns={viewingColumns}
              dataSource={filteredViewings}
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1200 }}
              locale={{ emptyText: <Empty description="Chưa có lịch xem căn hộ" /> }}
            />
          </TableCard>

          <TableCard title="Yêu cầu liên hệ từ website">
            <FilterBar>
              <Select
                value={contactFilter}
                onChange={setContactFilter}
                options={[
                  { label: 'Tất cả liên hệ', value: 'all' },
                  ...leadStatusOptions
                ]}
              />
            </FilterBar>
            <Toolbar>
              <strong>{filteredContacts.length}</strong>
              <span>yêu cầu liên hệ từ trang contact</span>
            </Toolbar>
            <Table
              rowKey={(record) => record.id || record._id}
              columns={contactColumns}
              dataSource={filteredContacts}
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1100 }}
              locale={{ emptyText: <Empty description="Chưa có yêu cầu liên hệ" /> }}
            />
          </TableCard>

          <TableCard title="Analytics hành vi khách hàng">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Khu vực nhiều căn hộ">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {(analytics?.districts || []).slice(0, 5).map((item) => (
                      <div key={item.district}>
                        <strong>{item.district}</strong>
                        <p>{item.apartments} căn • còn {item.availableUnits} • {(item.totalValue / 1000000000).toFixed(1)} tỷ</p>
                      </div>
                    ))}
                    {!analytics?.districts?.length && <Empty description="Chưa có dữ liệu khu vực" />}
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Căn được xem nhiều">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {(analytics?.topViewed || []).slice(0, 5).map((item) => (
                      <div key={item.apartment?._id || item.apartment?.id}>
                        <strong>{item.apartment?.title || 'Căn hộ'}</strong>
                        <p>{item.count} lượt xem • {item.interestCount} nhu cầu • {item.apartment?.priceLabel}</p>
                      </div>
                    ))}
                    {!analytics?.topViewed?.length && <Empty description="Chưa có dữ liệu lượt xem" />}
                  </Space>
                </Card>
              </Col>
            </Row>
          </TableCard>
        </div>
      </ManagementGrid>

      <Modal
        title={editingApartment ? `Sửa căn hộ: ${editingApartment.title}` : 'Sửa căn hộ'}
        open={Boolean(editingApartment)}
        onCancel={closeEditApartment}
        onOk={() => editForm.submit()}
        confirmLoading={saving}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={920}
        destroyOnHidden
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateApartment}
        >
          <ApartmentFormFields form={editForm} />
        </Form>
      </Modal>
    </AdminPage>
  );
}
