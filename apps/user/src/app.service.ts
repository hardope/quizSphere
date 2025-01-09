import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { PrismaService } from '@app/common';

@Injectable()
export class AppService {

    constructor (private readonly prisma: PrismaService) {}
	
    async handleCreatedUser (user: UserDto) {
        await this.prisma.user.create({ data: user });
    }

    handleFetchUsers () {
        return this.prisma.user.findMany();
    }
}
