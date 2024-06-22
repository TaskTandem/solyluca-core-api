import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsBoolean, IsUUID, ValidateIf } from 'class-validator';

export class FindCategoryDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsUUID(null, { each: true })
    @IsOptional()
    ids?: string[];

    @IsUUID()
    @IsOptional()
    @ValidateIf((object, value) => value !== null)
    parentId?: string|null;
    
    @IsString()
    @IsOptional()
    @MinLength(1)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;


    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if ( value === 'true' ) return true;
        if ( value === 'false' ) return false;
        return value;
    })
    isAvailable?: boolean;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if ( value === 'true' ) return true;
        if ( value === 'false' ) return false;
        return value;
    })
    isDeleted?: boolean;

}

