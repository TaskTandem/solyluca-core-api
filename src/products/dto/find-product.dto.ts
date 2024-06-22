import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsBoolean, IsUUID } from 'class-validator';

export class FindProductDto {
    
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsUUID(null, { each: true })
    @IsOptional()
    ids?: string[];
    
    @IsString()
    @IsOptional()
    @MinLength(1)
    name?: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    price?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    promotionalPrice?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

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

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    categoriesIds?: string[];

}




