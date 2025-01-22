import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsEmail, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateQuizDTO {
    
    @IsString()
    @ApiProperty({ example: "Quiz Title Sample" })
    title: string

    @IsString()
    @ApiProperty({ example: "Quiz Description Sample" })
    description: string

    @IsBoolean()
    @IsOptional()
    leaderboard?: boolean

    @IsNumber()
    @ApiProperty({ example: 10000 })
    @IsOptional()
    timeLimit?: number

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true })
    expires?: boolean

    @IsDateString()
    @ApiProperty({ example: "2021-09-09T00:00:00.000Z" })
    @IsOptional()
    expiresAt?: Date

}