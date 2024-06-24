import { IsString, IsUUID, MinLength } from 'class-validator';

export class RemoveImageProductDto {

    @IsUUID()
    id: string;

    @IsString()
    @MinLength(1)
    image: string;

}



