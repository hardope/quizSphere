import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { PrismaService } from 'libs/prisma/prisma.service';
// import { PrismaService } from '../../database-manager/src/prisma/prisma.service';

const users: UserDto[] = []

@Injectable()
export class AppService {

    constructor (private readonly prisma: PrismaService) {}
	
    handleCreatedUser (user: UserDto) {
        console.log('User created:', user);
        users.push(user);
        this.prisma.user.create({ data: user });
    }

    handleFetchUsers () {
        return this.prisma.user.findMany();
    }
}
