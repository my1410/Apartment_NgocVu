import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

function getKey() {
  const secret = process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET || 'development-only-secret';
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptString(value) {
  if (!value) return value;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptString(value) {
  if (!value) return value;
  const [ivHex, tagHex, encryptedHex] = value.split(':');
  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}
