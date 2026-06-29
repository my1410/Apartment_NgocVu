import { z } from 'zod';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { authCookieOptions, signAuthToken } from '../utils/token.js';
import { decryptString, encryptString } from '../utils/crypto.js';
import { sendVerificationEmail } from '../utils/email.js';

const registerSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(8),
  address: z.object({
    street: z.string().min(2),
    ward: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional()
  })
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const verifySchema = z.object({
  token: z.string().min(20)
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().min(8).optional(),
  address: z.object({
    street: z.string().min(2).optional(),
    ward: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional()
  }).optional()
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
}).refine((value) => value.currentPassword !== value.newPassword, {
  message: 'Mật khẩu mới phải khác mật khẩu hiện tại.',
  path: ['newPassword']
});

function serializeUser(user) {
  const raw = user.toObject ? user.toObject() : user;
  return {
    id: raw._id?.toString?.() || raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    phone: raw.encryptedPhone ? decryptString(raw.encryptedPhone) : undefined,
    address: raw.address,
    emailVerified: raw.emailVerified,
    createdAt: raw.createdAt
  };
}

function getClientUrl(req) {
  const origin = req.get('origin');
  if (origin) return origin;
  return (process.env.CLIENT_URL || 'http://127.0.0.1:5173').split(',')[0].trim();
}

export async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);
    const exists = await User.exists({ email: payload.email });
    if (exists) {
      res.status(409);
      throw new Error('Email đã tồn tại.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: 'customer',
      encryptedPhone: encryptString(payload.phone),
      address: payload.address,
      emailVerificationToken: crypto.createHash('sha256').update(token).digest('hex'),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const emailResult = await sendVerificationEmail({ to: user.email, token, clientUrl: getClientUrl(req) });
    const authToken = signAuthToken(user);
    res.cookie('token', authToken, authCookieOptions());
    res.status(201).json({
      data: {
        ...serializeUser(user),
        verificationPreviewUrl: emailResult.previewUrl
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email }).select('+password');
    if (!user || !(await user.comparePassword(payload.password))) {
      res.status(401);
      throw new Error('Email hoặc mật khẩu không đúng.');
    }

    const token = signAuthToken(user);
    res.cookie('token', token, authCookieOptions());
    res.json({ data: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export function logout(_req, res) {
  res.clearCookie('token', authCookieOptions());
  res.json({ message: 'Đã đăng xuất.' });
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ data: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const payload = updateProfileSchema.parse(req.body);
    const user = await User.findById(req.user._id).select('-password');

    if (payload.name !== undefined) user.name = payload.name;
    if (payload.phone !== undefined) user.encryptedPhone = encryptString(payload.phone);
    if (payload.address) {
      user.address = {
        ...(user.address?.toObject?.() || user.address || {}),
        ...payload.address
      };
    }

    await user.save();
    res.json({ data: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const payload = updatePasswordSchema.parse(req.body);
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(payload.currentPassword))) {
      res.status(401);
      throw new Error('Mật khẩu hiện tại không đúng.');
    }

    user.password = payload.newPassword;
    await user.save();
    res.json({ message: 'Đã đổi mật khẩu thành công.' });
  } catch (error) {
    next(error);
  }
}

export async function resendVerificationEmail(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('+emailVerificationToken +emailVerificationExpires');
    if (!user) {
      res.status(404);
      throw new Error('Không tìm thấy tài khoản.');
    }

    if (user.emailVerified) {
      return res.json({ message: 'Email của bạn đã được xác thực.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const emailResult = await sendVerificationEmail({ to: user.email, token, clientUrl: getClientUrl(req) });
    res.json({
      message: emailResult.sent
        ? 'Đã gửi email xác minh mới.'
        : 'Chưa cấu hình SMTP, dùng link xác minh dev để test.',
      data: {
        sent: emailResult.sent,
        verificationPreviewUrl: emailResult.previewUrl
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = verifySchema.parse(req.query);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() }
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      res.status(400);
      throw new Error('Link xác nhận email không hợp lệ hoặc đã hết hạn.');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email đã được xác nhận.' });
  } catch (error) {
    next(error);
  }
}
