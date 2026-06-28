import { z } from 'zod';
import { ContactRequest } from '../models/ContactRequest.js';
import { decryptString, encryptString } from '../utils/crypto.js';

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(8).optional(),
  district: z.string().max(80).optional(),
  budget: z.string().max(80).optional(),
  message: z.string().min(10).max(1200)
});

const updateContactSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']).optional()
});

function serializeContact(contact) {
  const raw = contact.toObject ? contact.toObject() : contact;
  return {
    ...raw,
    id: raw._id?.toString?.() || raw.id,
    phone: raw.encryptedPhone ? decryptString(raw.encryptedPhone) : undefined,
    encryptedPhone: undefined
  };
}

export async function createContactRequest(req, res, next) {
  try {
    const payload = contactSchema.parse(req.body);
    const contact = await ContactRequest.create({
      ...payload,
      encryptedPhone: payload.phone ? encryptString(payload.phone) : undefined,
      phone: undefined
    });

    res.status(201).json({ data: serializeContact(contact) });
  } catch (error) {
    next(error);
  }
}

export async function listContactRequests(_req, res, next) {
  try {
    const contacts = await ContactRequest.find().sort({ createdAt: -1 }).lean();
    res.json({ data: contacts.map(serializeContact) });
  } catch (error) {
    next(error);
  }
}

export async function updateContactRequest(req, res, next) {
  try {
    const payload = updateContactSchema.parse(req.body);
    const contact = await ContactRequest.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!contact) {
      res.status(404);
      throw new Error('Không tìm thấy yêu cầu liên hệ.');
    }

    res.json({ data: serializeContact(contact) });
  } catch (error) {
    next(error);
  }
}
