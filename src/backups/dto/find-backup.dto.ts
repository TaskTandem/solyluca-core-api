import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, MinLength, IsBoolean, IsUUID, IsDate, IsDateString } from 'class-validator';

export class FindBackuptDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    path?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    type?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if ( value === 'true' ) return true;
        if ( value === 'false' ) return false;
        return value;
    })
    isDeleted?: boolean;

    @IsDateString()
    @IsOptional()
    @Type(() => Date)
    createdAt?: Date;

    @IsDateString()
    @IsOptional()
    @Type(() => Date)
    createdAtFrom?: Date;

    @IsDateString()
    @IsOptional()
    @Type(() => Date)
    createdAtTo?: Date;
}


