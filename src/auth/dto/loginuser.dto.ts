import { IsEmail, IsString, Matches, MaxLength, MinLength, minLength } from "class-validator";

export class LoginUserDTO {
    @IsString()
    @IsEmail()
    email:string;
    @MinLength(6)
    @MaxLength(50)
    @IsString()   
    password:string;    
}