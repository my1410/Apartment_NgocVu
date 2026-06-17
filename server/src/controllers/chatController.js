import OpenAI from 'openai';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1).max(1200),
  context: z.object({
    totalApartments: z.number().optional(),
    districts: z.array(z.string()).optional()
  }).optional()
});

function localReply(message, context = {}) {
  const normalized = message.toLowerCase();
  if (normalized.includes('hải châu') || normalized.includes('hai chau')) {
    return 'Với Hải Châu, bạn nên ưu tiên căn 2 phòng ngủ gần Bạch Đằng hoặc Thuận Phước nếu muốn ở trung tâm và dễ cho thuê.';
  }
  if (normalized.includes('dưới 3') || normalized.includes('duoi 3')) {
    return 'Ngân sách dưới 3 tỷ có thể xem Hải Châu căn diện tích vừa, Thanh Khê hoặc Liên Chiểu. Hãy lọc giá 1-3 tỷ và chọn tối thiểu 2 phòng ngủ.';
  }
  return `Hiện có ${context.totalApartments || 0} căn phù hợp trong danh sách đang xem. Bạn có thể nói rõ quận, ngân sách và số phòng ngủ để mình gợi ý chính xác hơn.`;
}

export async function chat(req, res, next) {
  try {
    const { message, context } = chatSchema.parse(req.body);

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: localReply(message, context) });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Bạn là trợ lý tư vấn căn hộ tại Đà Nẵng. Trả lời ngắn gọn, thực tế, hỏi thêm khi thiếu ngân sách/khu vực/số phòng ngủ.'
        },
        {
          role: 'user',
          content: `Ngữ cảnh listing: ${JSON.stringify(context || {})}\n\nKhách hỏi: ${message}`
        }
      ]
    });

    res.json({ reply: response.choices?.[0]?.message?.content || localReply(message, context) });
  } catch (error) {
    next(error);
  }
}
