import { IsArray, IsEmail, IsEnum, IsString, MaxLength, MinLength, Validate,  } from "class-validator";
import { ValidRoles } from "../interfaces";
import { ValidRolesEnum } from "../enums/validRoles.enum";


export class CreateUserDto {
    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password:string;

    @IsString()
    fullName:string;

    @IsString({ each: true })
    @IsArray()
    @IsEnum(ValidRolesEnum, { each: true })
    roles: ValidRoles[];
}