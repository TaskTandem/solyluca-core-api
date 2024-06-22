import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsBoolean } from 'class-validator';

export class CreateBackupDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(1)
    path: string;

    @IsString()
    @MinLength(1)
    type: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if ( value === 'true' ) return true;
        if ( value === 'false' ) return false;
        return value;
    })
    isDeleted?: boolean;
}
