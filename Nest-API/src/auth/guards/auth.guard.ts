import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFroHeader(request);
    if(!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_KEY }
      );

      const user = await this.authService.findUserById( payload.id );
      if (!user) throw new UnauthorizedException('User Does Not Exists');
      if (!user.isActive) throw new UnauthorizedException('User Is Not Active');
      
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFroHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token: undefined;
  }
}