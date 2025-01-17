import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class PasswordResetDto {
    @ApiProperty({ example: 'password' })
    @IsString()
    password: string;

    @ApiProperty({ example: 'token' })
    @IsUUID()
    token: string;
}