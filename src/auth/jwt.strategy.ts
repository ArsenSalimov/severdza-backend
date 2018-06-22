import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {JwtPayload} from './JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
           jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
           secretOrKey: 'secretKey',
        });
    }

    async validate(payload: JwtPayload, done: Function): Promise<any> {
        const user = await this.authService.validateUser(payload);

        if (!user) {
            return done(new UnauthorizedException(), false);
        }

        done(null, user);
    }
}