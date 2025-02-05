import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString } from "class-validator"

export class submitAnswerDTO {

    @IsString()
    @ApiProperty({ example: "HTML is not a programming language" })
    @IsOptional()
    textAnswer?: string

    @IsString()
    @ApiProperty({ example: "60a3d2e5d4b7b3001f9f4e2b" })
    questionId: string

    @IsString()
    @ApiProperty({ example: "60a3d2e5d4b7b3001f9f4e2b" })
    @IsOptional()
    optionId?: string

    @IsString({ each: true })
    @ApiProperty({ example: ["60a3d2e5d4b7b3001f9f4e2b", "60a3d2e5d4b7b3001f9f4e2b"] })
    @IsOptional()
    optionIds?: string[]

    @IsBoolean()
    @ApiProperty({ example: true })
    @IsOptional()
    booleanAnswer?: boolean

}