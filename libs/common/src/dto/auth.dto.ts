import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class AuthDTO {

    @IsEmail()
    @ApiProperty({ example: "john@mail.com" })  
    email: string;
    
    @IsString()
    @ApiProperty({ example: "password" })
    password: string
}