import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDTO {
    @ApiProperty({description:"email",nullable:false, minLength:1})
    @IsString()
    @IsEmail()
    email:string;
    @IsString()
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    @ApiProperty({description:"password",nullable:false, minLength:1})
    password:string;
    @IsString()
    @MinLength(1)
    fullName:string;
}