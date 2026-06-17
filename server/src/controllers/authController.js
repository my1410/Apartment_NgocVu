import { z } from 'zod';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { authCookieOptions, signAuthToken } from '../utils/token.js';
import { encryptString } from '../utils/crypto.js';
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

    const emailResult = await sendVerificationEmail({ to: user.email, token, clientUrl: req.get('origin') });
    const authToken = signAuthToken(user);
    res.cookie('token', authToken, authCookieOptions());
    res.status(201).json({
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
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
    res.json({ data: { id: user._id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified } });
  } catch (error) {
    next(error);
  }
}

export function logout(_req, res) {
  res.clearCookie('token', authCookieOptions());
  res.json({ message: 'Đã đăng xuất.' });
}

export function me(req, res) {
  res.json({ data: req.user });
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
