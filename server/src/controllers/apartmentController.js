import { Apartment } from '../models/Apartment.js';
import { ApartmentInterest } from '../models/ApartmentInterest.js';
import { ApartmentView } from '../models/ApartmentView.js';
import { User } from '../models/User.js';
import { ViewingAppointment } from '../models/ViewingAppointment.js';
import { apartments as fallbackApartments } from '../data/apartments.js';
import { decryptString } from '../utils/crypto.js';

function normalizeApartment(item) {
  const raw = item.toObject ? item.toObject() : item;
  return {
    ...raw,
    id: raw._id?.toString?.() || raw.id,
    availableUnits: raw.availableUnits ?? 1,
    gallery: raw.gallery?.length ? raw.gallery : [raw.image].filter(Boolean),
    description: raw.description || 'Căn hộ được chọn lọc theo vị trí, tiện ích và khả năng khai thác thực tế tại Đà Nẵng.',
    highlights: raw.highlights?.length ? raw.highlights : raw.tags || []
  };
}

function matchesFallbackFilters(apartment, query) {
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  return (!query.district || apartment.district === query.district)
    && (!query.ward || apartment.ward === query.ward)
    && (!query.status || apartment.status === query.status)
    && (!query.bedrooms || apartment.bedrooms >= Number(query.bedrooms))
    && (!query.minArea || apartment.area >= Number(query.minArea))
    && (!query.onlyAvailable || (apartment.availableUnits ?? 1) > 0)
    && (!minPrice || apartment.price >= minPrice)
    && (!maxPrice || apartment.price <= maxPrice);
}

function sortFallback(items, sort) {
  const sorted = [...items];
  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  if (sort === 'area-desc') sorted.sort((a, b) => b.area - a.area);
  if (sort === 'newest') sorted.reverse();
  return sorted;
}

function serializeUser(user) {
  if (!user) return null;
  return {
    ...user,
    phone: user.encryptedPhone ? decryptString(user.encryptedPhone) : undefined,
    encryptedPhone: undefined
  };
}

function serializeAppointment(appointment) {
  const raw = appointment.toObject ? appointment.toObject() : appointment;
  return {
    ...raw,
    id: raw._id?.toString?.() || raw.id,
    apartment: raw.apartment ? normalizeApartment(raw.apartment) : raw.apartment,
    user: serializeUser(raw.user)
  };
}

function scoreRecommendation(apartment, preferences) {
  let score = 0;
  if ((apartment.availableUnits ?? 1) > 0) score += 10;
  if (apartment.featured) score += 4;
  if (preferences.districts.has(apartment.district)) score += 8;
  if (preferences.wards.has(apartment.ward)) score += 4;
  if (preferences.bedrooms.has(Number(apartment.bedrooms))) score += 3;
  if (preferences.maxPrice && apartment.price <= preferences.maxPrice * 1.12) score += 5;
  if (preferences.minPrice && apartment.price >= preferences.minPrice * 0.82) score += 2;
  return score;
}

export async function listApartments(req, res, next) {
  try {
    if (Apartment.db.readyState !== 1) {
      const data = sortFallback(fallbackApartments.filter((apartment) => matchesFallbackFilters(apartment, req.query)), req.query.sort)
        .map((apartment, index) => normalizeApartment({ ...apartment, id: apartment.id || `demo-${index + 1}` }));
      return res.json({ data });
    }

    const {
      district,
      ward,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      minArea,
      onlyAvailable,
      sort = 'featured'
    } = req.query;

    const query = {};
    if (district) query.district = district;
    if (ward) query.ward = ward;
    if (status) query.status = status;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (minArea) query.area = { $gte: Number(minArea) };
    if (onlyAvailable) query.availableUnits = { $gt: 0 };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      featured: { featured: -1, createdAt: -1 },
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'area-desc': { area: -1 }
    };
    const apartments = await Apartment.find(query).sort(sortMap[sort] || sortMap.featured).lean();
    res.json({ data: apartments.map(normalizeApartment) });
  } catch (error) {
    next(error);
  }
}

export async function getApartment(req, res, next) {
  try {
    if (Apartment.db.readyState !== 1) {
      const apartment = fallbackApartments.find((item, index) => (item.id || `demo-${index + 1}`) === req.params.id);
      if (!apartment) {
        res.status(404);
        throw new Error('Không tìm thấy căn hộ.');
      }
      return res.json({ data: normalizeApartment({ ...apartment, id: req.params.id }) });
    }

    const apartment = await Apartment.findById(req.params.id).lean();
    if (!apartment) {
      res.status(404);
      throw new Error('Không tìm thấy căn hộ.');
    }
    res.json({ data: normalizeApartment(apartment) });
  } catch (error) {
    next(error);
  }
}

export async function recordApartmentView(req, res, next) {
  try {
    const apartment = await Apartment.findById(req.params.id).select('_id');
    if (!apartment) {
      res.status(404);
      throw new Error('Không tìm thấy căn hộ.');
    }

    const view = await ApartmentView.findOneAndUpdate(
      { apartment: apartment._id, user: req.user._id },
      { $inc: { count: 1 }, $set: { lastViewedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ data: view });
  } catch (error) {
    next(error);
  }
}

export async function getPersonalRecommendations(req, res, next) {
  try {
    if (Apartment.db.readyState !== 1) {
      return res.json({ data: fallbackApartments.slice(0, 4).map(normalizeApartment), profile: null });
    }

    const [user, views, interests] = await Promise.all([
      User.findById(req.user._id).populate('favorites').lean(),
      ApartmentView.find({ user: req.user._id }).sort({ lastViewedAt: -1 }).limit(12).populate('apartment').lean(),
      ApartmentInterest.find({ user: req.user._id }).populate('apartment').lean()
    ]);

    const signals = [
      ...(user?.favorites || []),
      ...views.map((view) => view.apartment).filter(Boolean),
      ...interests.map((interest) => interest.apartment).filter(Boolean)
    ].map(normalizeApartment);

    const preferences = {
      districts: new Set(signals.map((item) => item.district).filter(Boolean)),
      wards: new Set(signals.map((item) => item.ward).filter(Boolean)),
      bedrooms: new Set(signals.map((item) => Number(item.bedrooms)).filter((value) => !Number.isNaN(value))),
      minPrice: signals.length ? Math.min(...signals.map((item) => Number(item.price || 0)).filter(Boolean)) : undefined,
      maxPrice: signals.length ? Math.max(...signals.map((item) => Number(item.price || 0)).filter(Boolean)) : undefined
    };

    const excludedIds = new Set(signals.map((item) => item.id || item._id?.toString()).filter(Boolean));
    const apartments = await Apartment.find().lean();
    const recommended = apartments
      .map(normalizeApartment)
      .filter((apartment) => !excludedIds.has(apartment.id))
      .map((apartment) => ({ apartment, score: scoreRecommendation(apartment, preferences) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ apartment, score }) => ({ ...apartment, matchScore: Math.min(98, Math.max(72, 72 + score)) }));

    const fallback = apartments
      .map(normalizeApartment)
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(0, 6);

    res.json({
      data: recommended.length ? recommended : fallback,
      profile: {
        viewedCount: views.length,
        favoriteCount: user?.favorites?.length || 0,
        interestedCount: interests.length,
        districts: Array.from(preferences.districts)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createApartment(req, res, next) {
  try {
    const apartment = await Apartment.create(req.body);
    res.status(201).json({ data: normalizeApartment(apartment) });
  } catch (error) {
    next(error);
  }
}

export async function updateApartment(req, res, next) {
  try {
    const allowedFields = [
      'title',
      'district',
      'districtLabel',
      'ward',
      'address',
      'price',
      'priceLabel',
      'rentLabel',
      'area',
      'bedrooms',
      'bathrooms',
      'type',
      'status',
      'availableUnits',
      'featured',
      'tags',
      'image',
      'gallery',
      'description',
      'highlights',
      'coordinates'
    ];
    const updates = allowedFields.reduce((payload, field) => {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
      return payload;
    }, {});

    ['price', 'area', 'bedrooms', 'bathrooms', 'availableUnits'].forEach((field) => {
      if (updates[field] !== undefined) updates[field] = Number(updates[field]);
    });

    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!apartment) {
      res.status(404);
      throw new Error('Không tìm thấy căn hộ.');
    }

    res.json({ data: normalizeApartment(apartment) });
  } catch (error) {
    next(error);
  }
}

export async function deleteApartment(req, res, next) {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) {
      res.status(404);
      throw new Error('Không tìm thấy căn hộ.');
    }

    await ApartmentInterest.deleteMany({ apartment: apartment._id });
    await ApartmentView.deleteMany({ apartment: apartment._id });
    await ViewingAppointment.deleteMany({ apartment: apartment._id });
    res.json({ data: { id: apartment._id.toString(), deleted: true } });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const apartment = await Apartment.findById(req.params.id).select('_id title');
    if (!apartment) {
      res.status(404);
      throw new Error('Không tìm thấy căn hộ.');
    }

    const user = await User.findById(req.user._id);
    const currentFavorites = user.favorites || [];
    const exists = currentFavorites.some((favoriteId) => favoriteId.toString() === apartment._id.toString());
    user.favorites = exists
      ? currentFavorites.filter((favoriteId) => favoriteId.toString() !== apartment._id.toString())
      : [...currentFavorites, apartment._id];
    await user.save();

    res.json({ data: { favorited: !exists, favoriteIds: user.favorites.map((id) => id.toString()) } });
  } catch (error) {
    next(error);
  }
}

export async function listFavorites(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ data: user.favorites.map(normalizeApartment) });
  } catch (error) {
    next(error);
  }
}

export async function createInterest(req, res, next) {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      res.status(404);
      throw new Error('Không tìm thấy căn hộ.');
    }

    if ((apartment.availableUnits ?? 1) <= 0) {
      res.status(409);
      throw new Error('Căn hộ này hiện đã hết số lượng.');
    }

    const interest = await ApartmentInterest.findOneAndUpdate(
      { apartment: apartment._id, user: req.user._id },
      { note: req.body?.note || 'Khách hàng bấm thích căn hộ này.', status: 'new' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ data: interest });
  } catch (error) {
    next(error);
  }
}

export async function createViewingAppointment(req, res, next) {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      res.status(404);
      throw new Error('Không tìm thấy căn hộ.');
    }

    if ((apartment.availableUnits ?? 1) <= 0) {
      res.status(409);
      throw new Error('Căn hộ này hiện đã hết số lượng để đặt lịch xem.');
    }

    const preferredAt = new Date(req.body.preferredAt);
    if (Number.isNaN(preferredAt.getTime())) {
      res.status(400);
      throw new Error('Thời gian xem căn hộ không hợp lệ.');
    }

    const appointment = await ViewingAppointment.create({
      apartment: apartment._id,
      user: req.user._id,
      preferredAt,
      note: req.body.note || ''
    });

    const populated = await ViewingAppointment.findById(appointment._id)
      .populate('apartment')
      .populate('user', 'name email address emailVerified encryptedPhone')
      .lean();

    res.status(201).json({ data: serializeAppointment(populated) });
  } catch (error) {
    next(error);
  }
}

export async function listMyViewingAppointments(req, res, next) {
  try {
    const appointments = await ViewingAppointment.find({ user: req.user._id })
      .sort({ preferredAt: -1 })
      .populate('apartment')
      .lean();
    res.json({ data: appointments.map(serializeAppointment) });
  } catch (error) {
    next(error);
  }
}

export async function listViewingAppointments(_req, res, next) {
  try {
    const appointments = await ViewingAppointment.find()
      .sort({ preferredAt: -1 })
      .populate('apartment')
      .populate('user', 'name email address emailVerified encryptedPhone')
      .lean();
    res.json({ data: appointments.map(serializeAppointment) });
  } catch (error) {
    next(error);
  }
}

export async function updateViewingAppointment(req, res, next) {
  try {
    const allowedStatuses = ['new', 'confirmed', 'visited', 'cancelled'];
    const updates = {};
    if (req.body.status !== undefined) {
      if (!allowedStatuses.includes(req.body.status)) {
        res.status(400);
        throw new Error('Trạng thái lịch xem không hợp lệ.');
      }
      updates.status = req.body.status;
    }
    if (req.body.adminNote !== undefined) updates.adminNote = req.body.adminNote;
    if (req.body.note !== undefined) updates.note = req.body.note;

    const appointment = await ViewingAppointment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('apartment')
      .populate('user', 'name email address emailVerified encryptedPhone')
      .lean();

    if (!appointment) {
      res.status(404);
      throw new Error('Không tìm thấy lịch xem căn hộ.');
    }

    res.json({ data: serializeAppointment(appointment) });
  } catch (error) {
    next(error);
  }
}

export async function getApartmentAnalytics(_req, res, next) {
  try {
    const [
      apartments,
      interests,
      views,
      appointments
    ] = await Promise.all([
      Apartment.find().lean(),
      ApartmentInterest.find().lean(),
      ApartmentView.find().sort({ count: -1 }).limit(20).populate('apartment', 'title districtLabel priceLabel').lean(),
      ViewingAppointment.find().lean()
    ]);

    const districtMap = apartments.reduce((map, apartment) => {
      const key = apartment.districtLabel || apartment.district || 'Khác';
      const current = map.get(key) || { district: key, apartments: 0, availableUnits: 0, totalValue: 0 };
      current.apartments += 1;
      current.availableUnits += Number(apartment.availableUnits ?? 1);
      current.totalValue += Number(apartment.price || 0);
      map.set(key, current);
      return map;
    }, new Map());

    const interestMap = interests.reduce((map, interest) => {
      const key = interest.apartment?.toString();
      map.set(key, (map.get(key) || 0) + 1);
      return map;
    }, new Map());

    const appointmentStatus = appointments.reduce((map, appointment) => {
      map[appointment.status] = (map[appointment.status] || 0) + 1;
      return map;
    }, {});

    res.json({
      data: {
        districts: Array.from(districtMap.values()).sort((a, b) => b.apartments - a.apartments),
        topViewed: views.map((view) => ({
          apartment: view.apartment,
          count: view.count,
          lastViewedAt: view.lastViewedAt,
          interestCount: interestMap.get(view.apartment?._id?.toString()) || 0
        })),
        appointmentStatus,
        conversion: {
          views: views.reduce((sum, view) => sum + Number(view.count || 0), 0),
          interests: interests.length,
          appointments: appointments.length,
          closedLeads: interests.filter((interest) => interest.status === 'closed').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function listInterests(_req, res, next) {
  try {
    const interests = await ApartmentInterest.find()
      .sort({ createdAt: -1 })
      .populate('apartment', 'title address priceLabel districtLabel ward')
      .populate('user', 'name email address emailVerified encryptedPhone')
      .lean();
    res.json({
      data: interests.map((interest) => ({
        ...interest,
        user: interest.user ? {
          ...interest.user,
          phone: decryptString(interest.user.encryptedPhone),
          encryptedPhone: undefined
        } : null
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function updateInterest(req, res, next) {
  try {
    const allowedStatuses = ['new', 'contacted', 'closed'];
    const updates = {};
    if (req.body.status !== undefined) {
      if (!allowedStatuses.includes(req.body.status)) {
        res.status(400);
        throw new Error('Trạng thái lead không hợp lệ.');
      }
      updates.status = req.body.status;
    }
    if (req.body.note !== undefined) {
      updates.note = req.body.note;
    }

    const interest = await ApartmentInterest.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('apartment', 'title address priceLabel districtLabel ward')
      .populate('user', 'name email address emailVerified encryptedPhone')
      .lean();

    if (!interest) {
      res.status(404);
      throw new Error('Không tìm thấy nhu cầu khách hàng.');
    }

    res.json({
      data: {
        ...interest,
        user: interest.user ? {
          ...interest.user,
          phone: decryptString(interest.user.encryptedPhone),
          encryptedPhone: undefined
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
}
