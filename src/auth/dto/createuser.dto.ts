import { IsEmail, IsString, Matches, MinLength, minLength } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @IsEmail()
    email:string;
    @IsString()
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })

    password:string;
    @IsString()
    @MinLength(1)
    fullName:string;
}