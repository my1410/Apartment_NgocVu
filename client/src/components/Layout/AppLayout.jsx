import { useEffect, useState } from 'react';
import { Button, Drawer, Select } from 'antd';
import {
  ContactsOutlined,
  HeartOutlined,
  HomeOutlined,
  LoginOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
  UserAddOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AiChatbot } from '../AiChatbot/AiChatbot.jsx';
import { getApartments } from '../../services/apiClient.js';
import { usePreferences } from '../../context/AppPreferences.jsx';
import {
  Header,
  HeaderInner,
  Logo,
  MobileDrawerContent,
  MobileMenuButton,
  MobilePreferenceControls,
  Nav,
  PageShell,
  PreferenceControls
} from './styles.js';

const navItems = [
  { to: '/', labelKey: 'nav.home', icon: <HomeOutlined /> },
  { to: '/apartments', labelKey: 'nav.apartments', icon: <UnorderedListOutlined /> },
  { to: '/favorites', labelKey: 'nav.favorites', icon: <HeartOutlined /> },
  { to: '/contact', labelKey: 'nav.contact', icon: <ContactsOutlined /> },
  { to: '/account', labelKey: 'nav.account', icon: <UserOutlined /> }
];

export function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatApartments, setChatApartments] = useState([]);
  const { language, setLanguage, themeMode, toggleTheme, t } = usePreferences();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    getApartments()
      .then(setChatApartments)
      .catch(() => setChatApartments([]));
  }, []);

  const renderPreferenceControls = () => (
    <>
      <Button
        icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
      >
        {themeMode === 'dark' ? t('prefs.theme.light') : t('prefs.theme.dark')}
      </Button>
      <Select
        aria-label={t('prefs.language')}
        value={language}
        onChange={setLanguage}
        options={[
          { value: 'vi', label: 'VI' },
          { value: 'en', label: 'EN' }
        ]}
      />
    </>
  );

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
                {item.icon} {t(item.labelKey)}
              </NavLink>
            ))}
            <PreferenceControls>{renderPreferenceControls()}</PreferenceControls>
            <Button type="primary" icon={<LoginOutlined />}>
              <Link to="/login">{t('common.login')}</Link>
            </Button>
            <Button icon={<UserAddOutlined />}>
              <Link to="/register">{t('common.register')}</Link>
            </Button>
          </Nav>
          <MobileMenuButton icon={<MenuOutlined />} onClick={() => setMenuOpen(true)}>
            {t('nav.menu')}
          </MobileMenuButton>
        </HeaderInner>
      </Header>
      <Drawer
        title={t('nav.drawerTitle')}
        placement="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        width={320}
      >
        <MobileDrawerContent>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.icon} {t(item.labelKey)}
            </NavLink>
          ))}
          <MobilePreferenceControls>{renderPreferenceControls()}</MobilePreferenceControls>
          <Button type="primary" size="large" icon={<LoginOutlined />} block>
            <Link to="/login">{t('common.login')}</Link>
          </Button>
          <Button size="large" icon={<UserAddOutlined />} block>
            <Link to="/register">{t('common.register')}</Link>
          </Button>
        </MobileDrawerContent>
      </Drawer>
      {children}
      <AiChatbot apartments={chatApartments} />
    </PageShell>
  );
}
