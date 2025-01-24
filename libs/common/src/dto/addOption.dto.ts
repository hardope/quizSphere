import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class addOptionDTO {
    
    @IsString()
    @ApiProperty({ example: "HTML" })
    text: string

    @IsString()
    @ApiProperty({ example: "60a3d2e5d4b7b3001f9f4e2b" })
    questionId: string

    @IsBoolean()
    @ApiProperty({ example: false })
    isCorrect: boolean

}