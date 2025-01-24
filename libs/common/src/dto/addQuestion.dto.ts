import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class addQuestionDTO {
    
    @IsString()
    @ApiProperty({ example: "Which of the following is a not programming language" })
    text: string

    @IsString()
    @ApiProperty({ example: "60a3d2e5d4b7b3001f9f4e2b" })
    quizId: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 2 })
    points?: number

    @IsEnum(['MultiChoice', 'Essay', 'Boolean'])
    @ApiProperty({ example: "MultiChoice" })
    type: 'MultiChoice' | 'Essay' | 'Boolean'

    @IsBoolean()
    @ApiProperty({ example: true })
    @IsOptional()
    booleanAnswer?: boolean

}