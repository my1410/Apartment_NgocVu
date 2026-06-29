import { daNangLocations } from '../data/vietnamLocations.js';

export function normalizeLocationText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function resolveDistrict(value = '') {
  const normalized = normalizeLocationText(value);
  if (!normalized) return undefined;

  return daNangLocations.find((district) => {
    const label = normalizeLocationText(district.label);
    const slug = normalizeLocationText(district.value.replaceAll('-', ' '));
    return normalized === district.value
      || normalized.includes(label)
      || normalized.includes(slug);
  });
}

export function resolveWard(value = '', districtValue) {
  const normalized = normalizeLocationText(value);
  if (!normalized) return undefined;

  const districts = districtValue
    ? daNangLocations.filter((district) => district.value === districtValue)
    : daNangLocations;

  return districts
    .flatMap((district) => district.wards.map((ward) => ({ district, ward })))
    .find(({ ward }) => normalized.includes(normalizeLocationText(ward)));
}

export function resolveAddressLocation(address = {}) {
  const addressText = [
    address.street,
    address.ward,
    address.district,
    address.city
  ].filter(Boolean).join(', ');
  const district = resolveDistrict(address.district) || resolveDistrict(addressText);
  const wardMatch = resolveWard(address.ward || addressText, district?.value);

  return {
    district: district?.value,
    districtLabel: district?.label,
    ward: wardMatch?.ward,
    fullAddress: addressText
  };
}

export function scoreApartmentByAddress(apartment, location) {
  if (!location?.district) return 0;

  let score = 0;
  if (apartment.district === location.district) score += 8;
  if (location.ward && apartment.ward === location.ward) score += 6;
  if ((apartment.availableUnits ?? 1) > 0) score += 3;
  if (apartment.featured) score += 2;
  return score;
}
