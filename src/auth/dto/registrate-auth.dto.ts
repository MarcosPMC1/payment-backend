import { IsEmail, IsString, Matches  } from "class-validator";

export class UserDto{
    @IsString()
    name: string

    @IsString()
    @Matches(/^(?=[0-9]*$)(?:.{11}|.{14})$/, { message: 'Not valid document number' })
    document: string

    @IsEmail()
    email: string

    @IsString()
    password: string
}