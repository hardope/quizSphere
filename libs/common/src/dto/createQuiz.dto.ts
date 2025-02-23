import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateQuizDTO {
    
    @IsString()
    @ApiProperty({ example: "Quiz Title Sample" })
    title: string

    @IsString()
    @ApiProperty({ example: "Quiz Description Sample" })
    description: string

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true})
    leaderboard?: boolean

    @IsNumber()
    @ApiProperty({ example: 10000 })
    @IsOptional()
    timeLimit?: number

    @IsNumber()
    @ApiProperty({ example: 70 })
    @IsOptional()
    passingScore?: number

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true})
    randomize?: boolean

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true})
    showResultsImmediately?: boolean

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true})
    multipleAttempts?: boolean

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true })
    expires?: boolean

    @IsDateString()
    @ApiProperty({ example: "2021-09-09T00:00:00.000Z" })
    @IsOptional()
    expiresAt?: Date

    @IsString()
    @ApiProperty({ example: "science", required:false })
    @IsOptional()
    category?: string

}