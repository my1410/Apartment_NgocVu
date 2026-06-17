import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.signedCookies?.token;
    if (!token) {
      res.status(401);
      throw new Error('Bạn cần đăng nhập.');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.sub).select('-password -encryptedPhone');
    if (!req.user) {
      res.status(401);
      throw new Error('Phiên đăng nhập không hợp lệ.');
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      res.status(403);
      return next(new Error('Bạn không có quyền thực hiện thao tác này.'));
    }
    next();
  };
}
