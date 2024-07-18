import { IsEmail, IsString, Length } from "class-validator";

export class UserDto{
    @IsString()
    name: string

    @IsString()
    @Length(11, 11)
    document: string

    @IsEmail()
    email: string

    @IsString()
    password: string
}