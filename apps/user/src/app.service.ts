import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { PrismaService } from '@app/common';

@Injectable()
export class AppService {

    constructor (private readonly prisma: PrismaService) {}
	
    async handleCreatedUser (user: UserDto) {
        try {
            const newUser = await this.prisma.user.create({ data: user });
            return {
                'status': true,
                'message': 'User created successfully.',
                'data': newUser
            }
        } catch (error) {
            if (error.code === 'P2002') {
                return{
                    'status': false,
                    'message': 'User already exists.'
                }
            } else {
                return false;
            }
        }
    }

    handleFetchUsers () {
        return this.prisma.user.findMany();
    }
}
