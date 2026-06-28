import { useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import {
  ContactsOutlined,
  HeartOutlined,
  HomeOutlined,
  LoginOutlined,
  MenuOutlined,
  UserOutlined,
  UserAddOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AiChatbot } from '../AiChatbot/AiChatbot.jsx';
import { getApartments } from '../../services/apiClient.js';
import { Header, HeaderInner, Logo, MobileDrawerContent, MobileMenuButton, Nav, PageShell } from './styles.js';

const navItems = [
  { to: '/', label: 'Trang chủ', icon: <HomeOutlined /> },
  { to: '/apartments', label: 'Danh mục căn hộ', icon: <UnorderedListOutlined /> },
  { to: '/favorites', label: 'Căn hộ ưa thích', icon: <HeartOutlined /> },
  { to: '/contact', label: 'Liên hệ', icon: <ContactsOutlined /> },
  { to: '/account', label: 'Tài khoản', icon: <UserOutlined /> }
];

export function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatApartments, setChatApartments] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    getApartments()
      .then(setChatApartments)
      .catch(() => setChatApartments([]));
  }, []);

  return (
    <PageShell>
      <Header>
        <HeaderInner>
          <Link to="/">
            <Logo>
              <span>DN</span>
              Apartment Hub
            </Logo>
          </Link>
          <Nav>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                {item.icon} {item.label}
              </NavLink>
            ))}
            <Button type="primary" icon={<LoginOutlined />}>
              <Link to="/login">Đăng nhập</Link>
            </Button>
            <Button icon={<UserAddOutlined />}>
              <Link to="/register">Đăng ký</Link>
            </Button>
          </Nav>
          <MobileMenuButton icon={<MenuOutlined />} onClick={() => setMenuOpen(true)}>
            Menu
          </MobileMenuButton>
        </HeaderInner>
      </Header>
      <Drawer
        title="Điều hướng"
        placement="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        width={320}
      >
        <MobileDrawerContent>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.icon} {item.label}
            </NavLink>
          ))}
          <Button type="primary" size="large" icon={<LoginOutlined />} block>
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button size="large" icon={<UserAddOutlined />} block>
            <Link to="/register">Đăng ký</Link>
          </Button>
        </MobileDrawerContent>
      </Drawer>
      {children}
      <AiChatbot apartments={chatApartments} />
    </PageShell>
  );
}
