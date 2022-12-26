import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength,  } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({description:"email",nullable:false, minLength:1})
    @IsString()
    @IsEmail()
    email:string;
    @MinLength(6)
    @MaxLength(50)
    @IsString()   
    @ApiProperty({description:"password",nullable:false, minLength:1})
    password:string;    
}