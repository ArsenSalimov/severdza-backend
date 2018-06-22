import * as jwt from 'jsonwebtoken';
import {Injectable} from '@nestjs/common';
import {JwtPayload} from './JwtPayload';

@Injectable()
export class AuthService {
    async createToken(): Promise<any> {
        const user: JwtPayload = {email: 'test@email.com'};
        const expiresIn = 3600;
        const accessToken = jwt.sign(user, 'secretKey', {expiresIn});
        return {
            expiresIn,
            accessToken,
        };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return {};
    }
}