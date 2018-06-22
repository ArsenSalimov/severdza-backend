import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';
import {Repository} from 'typeorm';
import {UserDto} from './user.dto';
import * as bcrypt from 'bcrypt';
import {UserAlreadyExistException} from './exceptions/UserAlreadyExist.exception';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    }

    async isUserExist(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({email});
        return user !== undefined;
    }

    async createUser(userDto: UserDto): Promise<User> {
        if (await this.isUserExist(userDto.email)) {
            throw new UserAlreadyExistException(userDto.email);
        }

        const user = this.userRepository.create({
            email: userDto.email,
            password: await this.hashPassword(userDto.password),
        });

        return this.userRepository.save(user);
    }

    private hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}