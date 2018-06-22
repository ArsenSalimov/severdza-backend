import {Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserService} from '../user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly userService: UserService) {
    }

    @Post('sign-in')
    async signIn(): Promise<any> {
        return await this.authService.createToken();
    }

    @Post('sign-up')
    async signUp(): Promise<any> {
        return;
    }
}