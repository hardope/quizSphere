import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { PrismaService } from '@app/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {

    constructor (private readonly prisma: PrismaService) {}
	
    async handleCreatedUser (user: UserDto) {
        try {
            user.password = await bcrypt.hash(user.password, 10);
            const newUser = await this.prisma.user.create({ data: user });
            delete newUser.password;
            return {
                message: 'User created successfully',
                user: newUser,
                status: true
            }
        } catch (error) {
            if (error.code === 'P2002') {
                {
                    return {
                        message: 'User already exists',
                        status: false
                    }
                }
            } else {
                return {
                    message: 'An error occurred',
                    status: false
                }
            }
        }
    }

    handleFetchUsers () {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
            }
        });
    }
}
