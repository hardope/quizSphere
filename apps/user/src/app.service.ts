import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './user.dto';
import { PrismaService } from '@app/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from '@app/common/dto/updateUser.dto';

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
                Logger.log(error, 'UserService - AppService');
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

    handleFetchUserById (id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
            }
        });
    }

    async handleFetchUserByEmail (data: any) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: data.email
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true
                }
            });
            if (!user) {
                return {
                    message: 'User not found',
                    status: false
                }
            }
            return user;
        } catch (error) {
            Logger.error(error, 'UserService');
            return {
                message: 'An error occurred',
                status: false
            }
        }
    }

    async handleUpdateUser (data: any) {
        try {
            if (data.user.id !== data.id) {
                return {
                    message: 'You are not authorized to perform this action',
                    status: false
                }
            }
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: data.id
                },
                data: data.data
            });
            Logger.log(`User updated successfully ${updatedUser.id}`, 'UserService - AppService');
            return {
                message: 'User updated successfully',
                status: true
            }
        } catch (error) {
            Logger.error(error, 'UserService - AppService');
            return {
                message: 'An error occurred',
                status: false
            }
        }
    }
}
