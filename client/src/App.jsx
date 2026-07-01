import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout.jsx';
import { usePreferences } from './context/AppPreferences.jsx';
import { HomePage } from './pages/Home/HomePage.jsx';
import { LoginPage } from './pages/Auth/LoginPage.jsx';

const ApartmentsPage = lazy(() => import('./pages/Apartments/ApartmentsPage.jsx')
  .then((module) => ({ default: module.ApartmentsPage })));
const ApartmentDetailPage = lazy(() => import('./pages/ApartmentDetail/ApartmentDetailPage.jsx')
  .then((module) => ({ default: module.ApartmentDetailPage })));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.jsx')
  .then((module) => ({ default: module.AdminDashboard })));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage.jsx')
  .then((module) => ({ default: module.RegisterPage })));
const VerifyEmailPage = lazy(() => import('./pages/Auth/VerifyEmailPage.jsx')
  .then((module) => ({ default: module.VerifyEmailPage })));
const FavoritesPage = lazy(() => import('./pages/Favorites/FavoritesPage.jsx')
  .then((module) => ({ default: module.FavoritesPage })));
const ContactPage = lazy(() => import('./pages/Contact/ContactPage.jsx')
  .then((module) => ({ default: module.ContactPage })));
const AccountPage = lazy(() => import('./pages/Account/AccountPage.jsx')
  .then((module) => ({ default: module.AccountPage })));

const routerBasename = import.meta.env.BASE_URL === '/'
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  const { t } = usePreferences();
  return (
    <BrowserRouter basename={routerBasename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout>
        <Suspense fallback={<div style={{ padding: 40 }}>{t('common.loading')}</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apartments" element={<ApartmentsPage />} />
            <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  );
}
