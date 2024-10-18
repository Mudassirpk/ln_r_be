import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private JWT_SECRET;
  constructor(private readonly config: ConfigService) {
    this.JWT_SECRET = config.get('JWT_SECRET');
  }

  sign(payload: Record<string, unknown>) {
    const JWT_SECRET = this.config.get('JWT_SECRET');
    if (!JWT_SECRET) {
      throw new Error('JWT SECRET not found');
    }

    return jwt.sign(payload, JWT_SECRET);
  }

  verify(token: string) {
    const decoded = jwt.verify(token, this.JWT_SECRET);
    if (decoded) return decoded;
    return false;
  }
}
