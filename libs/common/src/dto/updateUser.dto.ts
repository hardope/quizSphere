import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UpdateUserDTO {

    @IsString()
    @ApiProperty({ example: "john" })  
    firstName: string;
    
    @IsString()
    @ApiProperty({ example: "Wick" })
    lastName: string
}