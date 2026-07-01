import axios from 'axios';
import { mockApartments } from '../data/mockApartments.js';

const defaultApiUrl = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:4000/api`
  : 'http://localhost:4000/api';

const configuredApiUrl = import.meta.env.VITE_API_URL;
const apiBaseUrl = typeof window !== 'undefined' && configuredApiUrl
  ? configuredApiUrl.replace('localhost', window.location.hostname)
  : configuredApiUrl || defaultApiUrl;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 12000
});

function normalizeApartment(apartment) {
  return {
    ...apartment,
    availableUnits: apartment.availableUnits ?? 1,
    gallery: apartment.gallery?.length ? apartment.gallery : [apartment.image].filter(Boolean),
    description: apartment.description || 'Căn hộ được chọn lọc theo vị trí, tiện ích, ngân sách và khả năng khai thác thực tế.',
    highlights: apartment.highlights?.length ? apartment.highlights : apartment.tags || []
  };
}

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function isGreeting(message) {
  const normalized = normalizeText(message).trim();
  return /^(hi|hello|hey|chao|xin chao|chao ban)(\s|!|\.|,)?$/.test(normalized);
}

function detectDistrict(message) {
  const normalized = normalizeText(message);
  const districtMap = [
    ['hai-chau', ['hai chau', 'haichau']],
    ['son-tra', ['son tra', 'sontra']],
    ['ngu-hanh-son', ['ngu hanh son', 'nguhanhson', 'my khe', 'my an']],
    ['thanh-khe', ['thanh khe', 'thanhkhe', 'san bay']],
    ['lien-chieu', ['lien chieu', 'lienchieu', 'hoa khanh']],
    ['cam-le', ['cam le', 'camle', 'khue trung']]
  ];

  return districtMap.find(([, keywords]) => (
    keywords.some((keyword) => normalized.includes(keyword))
  ))?.[0];
}

function detectBudget(message) {
  const normalized = normalizeText(message);
  const underMatch = normalized.match(/(?:duoi|toi da|tam|khoang|max)\s*(\d+(?:[.,]\d+)?)\s*(?:ty|ti)/);
  if (underMatch) return Number(underMatch[1].replace(',', '.')) * 1000000000;

  const numberMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:ty|ti)/);
  if (numberMatch && (normalized.includes('duoi') || normalized.includes('max'))) {
    return Number(numberMatch[1].replace(',', '.')) * 1000000000;
  }

  return undefined;
}

function detectBedrooms(message) {
  const normalized = normalizeText(message);
  const match = normalized.match(/(\d+)\s*(?:pn|phong ngu|bedroom)/);
  return match ? Number(match[1]) : undefined;
}

function scoreApartment(apartment, preferences) {
  let score = 0;
  if ((apartment.availableUnits ?? 1) > 0) score += 3;
  if (apartment.featured) score += 2;
  if (preferences.district && apartment.district === preferences.district) score += 5;
  if (preferences.budget && apartment.price <= preferences.budget) score += 4;
  if (preferences.bedrooms && apartment.bedrooms >= preferences.bedrooms) score += 3;
  return score;
}

function localAssistantReply(message, context = {}) {
  if (isGreeting(message)) {
    return 'Chào bạn, mình đây. Bạn muốn tìm căn theo quận nào, ngân sách khoảng bao nhiêu và cần mấy phòng ngủ?';
  }

  const preferences = {
    district: detectDistrict(message),
    budget: detectBudget(message),
    bedrooms: detectBedrooms(message)
  };
  const contextApartments = context.apartments?.length ? context.apartments : [];
  const pool = (contextApartments.length ? contextApartments : mockApartments).map(normalizeApartment);
  const available = pool.filter((apartment) => (apartment.availableUnits ?? 1) > 0);
  const candidates = (available.length ? available : pool)
    .map((apartment) => ({ apartment, score: scoreApartment(apartment, preferences) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ apartment }) => apartment);

  if (!candidates.length) {
    return 'Mình chưa có dữ liệu căn hộ để gợi ý. Bạn thử mở danh mục căn hộ hoặc nhập khu vực/ngân sách cụ thể hơn nhé.';
  }

  const hasPreference = preferences.district || preferences.budget || preferences.bedrooms;
  const intro = hasPreference
    ? 'Dựa trên nhu cầu bạn vừa nói, mình gợi ý:'
    : 'Mình đang dùng dữ liệu có sẵn để tư vấn nhanh. Bạn có thể bắt đầu với các căn nổi bật này:';
  const lines = candidates.map((apartment, index) => {
    const tags = apartment.tags?.length ? `, hợp với ${apartment.tags.slice(0, 2).join(', ')}` : '';
    const price = apartment.priceLabel || `${(apartment.price / 1000000000).toFixed(2)} tỷ`;
    return `${index + 1}. ${apartment.title} - ${apartment.districtLabel || apartment.district}, ${price}, ${apartment.area}m2, ${apartment.bedrooms}PN${tags}.`;
  });

  return `${intro}\n${lines.join('\n')}\nBạn nói thêm quận, ngân sách hoặc số phòng ngủ, mình sẽ lọc sát hơn.`;
}

export async function getApartments(filters = {}) {
  try {
    const { data } = await api.get('/apartments', { params: filters });
    return data.data.map(normalizeApartment);
  } catch {
    return mockApartments.map(normalizeApartment);
  }
}

export async function getApartment(id) {
  try {
    const { data } = await api.get(`/apartments/${id}`);
    return normalizeApartment(data.data);
  } catch {
    return normalizeApartment(mockApartments.find((apartment) => apartment.id === id) || mockApartments[0]);
  }
}

export async function createApartment(payload) {
  const { data } = await api.post('/apartments', payload);
  return normalizeApartment(data.data);
}

export async function updateApartment(apartmentId, payload) {
  const { data } = await api.patch(`/apartments/${apartmentId}`, payload);
  return normalizeApartment(data.data);
}

export async function deleteApartment(apartmentId) {
  const { data } = await api.delete(`/apartments/${apartmentId}`);
  return data.data;
}

export async function register(values) {
  const { data } = await api.post('/auth/register', values);
  return data.data;
}

export async function login(values) {
  const { data } = await api.post('/auth/login', values);
  return data.data;
}

export async function verifyEmail(token) {
  const { data } = await api.get('/auth/verify-email', { params: { token } });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function updateCurrentUser(payload) {
  const { data } = await api.patch('/auth/me', payload);
  return data.data;
}

export async function updatePassword(payload) {
  const { data } = await api.patch('/auth/password', payload);
  return data;
}

export async function resendVerificationEmail() {
  const { data } = await api.post('/auth/resend-verification');
  return data;
}

export async function toggleFavorite(apartmentId) {
  const { data } = await api.post(`/apartments/${apartmentId}/favorite`);
  return data.data;
}

export async function getFavorites() {
  const { data } = await api.get('/apartments/favorites/me');
  return data.data.map(normalizeApartment);
}

export async function getPersonalRecommendations() {
  const { data } = await api.get('/apartments/recommendations/me');
  return {
    apartments: data.data.map(normalizeApartment),
    profile: data.profile
  };
}

export async function createInterest(apartmentId, note) {
  const { data } = await api.post(`/apartments/${apartmentId}/interest`, { note });
  return data.data;
}

export async function recordApartmentView(apartmentId) {
  const { data } = await api.post(`/apartments/${apartmentId}/view`);
  return data.data;
}

export async function createViewingAppointment(apartmentId, payload) {
  const { data } = await api.post(`/apartments/${apartmentId}/viewing`, payload);
  return data.data;
}

export async function getMyViewingAppointments() {
  const { data } = await api.get('/apartments/viewings/me');
  return data.data;
}

export async function getViewingAppointments() {
  const { data } = await api.get('/apartments/viewings');
  return data.data;
}

export async function updateViewingAppointment(appointmentId, payload) {
  const { data } = await api.patch(`/apartments/viewings/${appointmentId}`, payload);
  return data.data;
}

export async function getInterests() {
  const { data } = await api.get('/apartments/interests');
  return data.data;
}

export async function updateInterest(interestId, payload) {
  const { data } = await api.patch(`/apartments/interests/${interestId}`, payload);
  return data.data;
}

export async function createContactRequest(payload) {
  const { data } = await api.post('/contact', payload);
  return data.data;
}

export async function getContactRequests() {
  const { data } = await api.get('/contact');
  return data.data;
}

export async function updateContactRequest(contactId, payload) {
  const { data } = await api.patch(`/contact/${contactId}`, payload);
  return data.data;
}

export async function getApartmentAnalytics() {
  const { data } = await api.get('/apartments/analytics/overview');
  return data.data;
}

export async function logout() {
  const { data } = await api.post('/auth/logout');
  return data;
}

export async function askAssistant(message, context = {}) {
  try {
    const { data } = await api.post('/chat', { message, context });
    return data.reply;
  } catch {
    return localAssistantReply(message, context);
  }
}

export default api;
