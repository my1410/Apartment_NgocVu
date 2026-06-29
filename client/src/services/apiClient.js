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

export async function createInterest(apartmentId, note) {
  const { data } = await api.post(`/apartments/${apartmentId}/interest`, { note });
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

export async function logout() {
  const { data } = await api.post('/auth/logout');
  return data;
}

export async function askAssistant(message, context = {}) {
  try {
    const { data } = await api.post('/chat', { message, context });
    return data.reply;
  } catch {
    return 'Mình chưa kết nối được server AI, nhưng bạn có thể thử lọc theo quận, giá và số phòng ngủ để tìm căn phù hợp.';
  }
}

export default api;
