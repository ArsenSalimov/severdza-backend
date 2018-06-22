import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserService} from '../user/user.service';
import {UserDto} from '../user/user.dto';

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
    async signUp(@Body() userDto: UserDto): Promise<any> {
        return this.userService.createUser(userDto);
    }
}