import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export class Crypto {
  private readonly secretKey: Promise<Buffer>;
  private readonly randomBytes: Buffer;

  constructor(secret: string) {
    this.secretKey = promisify(scrypt)(secret, 'salt', 32) as Promise<Buffer>;
    this.randomBytes = randomBytes(16);
  }

  async cipher(password: string) {
    const cipher = createCipheriv(
      'aes-256-ctr',
      await this.secretKey,
      this.randomBytes,
    );
    const result = Buffer.concat([cipher.update(password), cipher.final()]);
    return result;
  }

  async decipher(password: Buffer) {
    const decipher = createDecipheriv(
      'aes-256-ctr',
      await this.secretKey,
      this.randomBytes,
    );
    const result = Buffer.concat([decipher.update(password), decipher.final()]);
    return result.toString();
  }
}
