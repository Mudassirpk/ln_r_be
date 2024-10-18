import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split('Bearer ')[1];
    if (!token) throw new HttpException('Unauthorized', 401);
    const verified = this.jwt.verify(token);
    if (!verified) return false;
    request.user = verified;
    return true;
  }
}
