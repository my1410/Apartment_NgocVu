import OpenAI from 'openai';
import { z } from 'zod';
import { Apartment } from '../models/Apartment.js';
import { apartments as fallbackApartments } from '../data/apartments.js';

const chatSchema = z.object({
  message: z.string().min(1).max(1200),
  context: z.object({
    totalApartments: z.number().optional(),
    districts: z.array(z.string()).optional(),
    apartments: z.array(z.object({
      title: z.string().optional(),
      district: z.string().optional(),
      districtLabel: z.string().optional(),
      ward: z.string().optional(),
      price: z.number().optional(),
      priceLabel: z.string().optional(),
      area: z.number().optional(),
      bedrooms: z.number().optional(),
      bathrooms: z.number().optional(),
      status: z.string().optional(),
      availableUnits: z.number().optional(),
      tags: z.array(z.string()).optional()
    }).passthrough()).optional()
  }).optional()
});

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
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
  return districtMap.find(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))?.[0];
}

function isGreeting(message) {
  const normalized = normalizeText(message).trim();
  return /^(hi|hello|hey|chao|xin chao|chao ban)(\s|!|\.|,)?$/.test(normalized);
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

async function getRecommendationPool(context = {}) {
  if (context.apartments?.length) return context.apartments;

  if (Apartment.db.readyState === 1) {
    const apartments = await Apartment.find().sort({ featured: -1, createdAt: -1 }).limit(24).lean();
    return apartments.map((apartment) => ({
      ...apartment,
      id: apartment._id?.toString()
    }));
  }

  return fallbackApartments;
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

async function localReply(message, context = {}) {
  if (isGreeting(message)) {
    return 'Chào bạn, mình đây. Bạn muốn tìm căn theo quận nào, ngân sách khoảng bao nhiêu và cần mấy phòng ngủ?';
  }

  const preferences = {
    district: detectDistrict(message),
    budget: detectBudget(message),
    bedrooms: detectBedrooms(message)
  };
  const pool = await getRecommendationPool(context);
  const available = pool.filter((apartment) => (apartment.availableUnits ?? 1) > 0);
  const candidates = (available.length ? available : pool)
    .map((apartment) => ({ apartment, score: scoreApartment(apartment, preferences) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ apartment }) => apartment);

  if (!candidates.length) {
    return 'Mình chưa có dữ liệu căn hộ để gợi ý. Bạn thử mở danh mục căn hộ hoặc nhập khu vực/ngân sách cụ thể hơn nhé.';
  }

  const intro = preferences.district || preferences.budget || preferences.bedrooms
    ? 'Dựa trên nhu cầu bạn vừa nói, mình gợi ý:'
    : 'Bạn có thể bắt đầu với các căn nổi bật còn hàng này:';
  const lines = candidates.map((apartment, index) => {
    const tags = apartment.tags?.length ? `, hợp với ${apartment.tags.slice(0, 2).join(', ')}` : '';
    return `${index + 1}. ${apartment.title} - ${apartment.districtLabel || apartment.district}, ${apartment.priceLabel || `${(apartment.price / 1000000000).toFixed(2)} tỷ`}, ${apartment.area}m2, ${apartment.bedrooms}PN${tags}.`;
  });

  return `${intro}\n${lines.join('\n')}\nBạn có thể nói thêm ngân sách, quận hoặc số phòng ngủ để mình lọc sát hơn.`;
}

export async function chat(req, res, next) {
  try {
    const { message, context } = chatSchema.parse(req.body);

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: await localReply(message, context) });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let response;
    try {
      response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Bạn là trợ lý tư vấn căn hộ tại Đà Nẵng. Trả lời ngắn gọn, thực tế, hỏi thêm khi thiếu ngân sách/khu vực/số phòng ngủ. Chỉ gợi ý dựa trên listing được cung cấp.'
          },
          {
            role: 'user',
            content: `Ngữ cảnh listing: ${JSON.stringify(context || {})}\n\nKhách hỏi: ${message}`
          }
        ]
      });
    } catch {
      return res.json({ reply: await localReply(message, context) });
    }

    res.json({ reply: response.choices?.[0]?.message?.content || await localReply(message, context) });
  } catch (error) {
    next(error);
  }
}
