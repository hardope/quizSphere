import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtNjAxOXYwMTAwMDJ2dDhjaDdsMnBkeW4iLCJlbWFpbCI6ImpvaG5AbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJjcmVhdGVkQXQiOiIyMDI1LTAxLTE3VDAwOjQwOjQzLjc2NloiLCJ1cGRhdGVkQXQiOiIyMDI1LTAxLTE3VDAwOjQwOjQzLjc2NloiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTczOTIxOTgzNywiZXhwIjoxNzM5ODI0NjM3fQ.A1HcYJmj-r9zjWMHNfu10JXNpixQl1TPwXJWp-Dq74s'})
    @IsString()
    token: string

}
