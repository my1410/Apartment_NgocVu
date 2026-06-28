import { useEffect } from 'react';
import { App as AntdApp, Button, Form, Input, Select } from 'antd';
import { CustomerServiceOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { daNangLocations } from '../../data/vietnamLocations.js';
import { createContactRequest, getCurrentUser } from '../../services/apiClient.js';
import { ContactCard, ContactHero, ContactInfoGrid, ContactPageWrap } from './styles.js';

export function ContactPage() {
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          district: user.address?.district
        });
      })
      .catch(() => {});
  }, [form]);

  const handleSubmit = async (values) => {
    try {
      await createContactRequest(values);
      message.success('Đã gửi yêu cầu tư vấn. Admin sẽ thấy trong CRM liên hệ.');
      form.resetFields(['budget', 'message']);
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể gửi liên hệ.');
    }
  };

  return (
    <ContactPageWrap>
      <ContactHero>
        <span>Tư vấn căn hộ Đà Nẵng</span>
        <h1>Nói nhu cầu, đội tư vấn sẽ lọc căn phù hợp.</h1>
        <p>
          Form này gửi thẳng về khu quản trị để admin theo dõi, gọi điện, gửi email và chuyển trạng thái chăm sóc khách hàng.
        </p>
        <ContactInfoGrid>
          <div>
            <strong><PhoneOutlined /> Hotline</strong>
            <p>0900 000 000 - hỗ trợ tư vấn khu vực Hải Châu, Sơn Trà, Ngũ Hành Sơn.</p>
          </div>
          <div>
            <strong><MailOutlined /> Email</strong>
            <p>support@dnapartmenthub.vn</p>
          </div>
          <div>
            <strong><CustomerServiceOutlined /> Gợi ý nhanh</strong>
            <p><Link to="/apartments">Xem danh mục căn hộ</Link> hoặc <Link to="/favorites">mở căn hộ ưa thích</Link> trước khi gửi nhu cầu.</p>
          </div>
        </ContactInfoGrid>
      </ContactHero>

      <ContactCard>
        <h2>Gửi yêu cầu liên hệ</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, min: 2 }]}>
            <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@gmail.com" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, min: 8 }]}>
            <Input prefix={<PhoneOutlined />} placeholder="0900000000" />
          </Form.Item>
          <Form.Item name="district" label="Khu vực quan tâm">
            <Select
              allowClear
              placeholder="Chọn quận"
              options={daNangLocations.map((item) => ({ label: item.label, value: item.label }))}
            />
          </Form.Item>
          <Form.Item name="budget" label="Ngân sách dự kiến">
            <Input placeholder="Ví dụ: 2.5 - 4 tỷ hoặc 18 triệu/tháng" />
          </Form.Item>
          <Form.Item name="message" label="Nhu cầu chi tiết" rules={[{ required: true, min: 10 }]}>
            <Input.TextArea rows={5} placeholder="Bạn cần mấy phòng ngủ, gần khu nào, mua hay thuê, thời gian dọn vào..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi cho admin tư vấn
          </Button>
        </Form>
      </ContactCard>
    </ContactPageWrap>
  );
}
