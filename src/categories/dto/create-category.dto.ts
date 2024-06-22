import { Transform } from 'class-transformer';
import { IsString, MinLength, IsBoolean, IsOptional, IsArray, IsUUID, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(1)
    description: string;

    @IsUUID(null, { message: 'parentId must be a UUID or null' })
    @ValidateIf((object, value) => value !== null)
    parentId: string | null;
 
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
    images?: string[];
}


