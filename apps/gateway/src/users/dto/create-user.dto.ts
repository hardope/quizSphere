import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    @ApiProperty({ example: "john@mail.com" })    
    email: string

    @IsString()
    @ApiProperty({ example: "John", required: false })
    firstName?: string

    @IsString()
    @ApiProperty({ example: "Doe", required: false })
    lastName?: string

    @IsString()
    @ApiProperty({ example: "password" })
    password: string
}
