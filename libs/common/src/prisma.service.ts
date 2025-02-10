import {  Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
config();

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
