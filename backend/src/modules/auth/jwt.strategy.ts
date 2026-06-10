import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

/** JWT strategy: validates tokens and attaches user to request */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string; email: string; role: string }) {
        const user = await this.userRepo.findOne({ where: { id: payload.sub } });
        if (!user) {
            throw new UnauthorizedException();
        }
        // This object gets attached to req.user
        return { id: user.id, email: user.email, role: user.role };
    }
}
