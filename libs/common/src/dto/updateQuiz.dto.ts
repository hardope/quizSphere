import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateQuizDTO {
    
    @IsString()
    @IsOptional()
    @ApiProperty({ example: "Quiz Title Sample", required: false })
    title?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: "Quiz Description Sample", required: false })
    description?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    leaderboard?: boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 10000, required: false })
    timeLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 70, required: false })
    passingScore?: number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    randomize?: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    showResultsImmediately?: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    multipleAttempts?: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true, required: false })
    expires?: boolean;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ example: "2021-09-09T00:00:00.000Z", required: false })
    expiresAt?: Date;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: "science", required: false })
    category?: string;
}