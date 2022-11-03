import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, minLength } from "class-validator";

export class CreateProductDto {


   @IsString() 
   @MinLength(1)   
    title:string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;

    @IsString()
    @IsOptional()
    descripction?:string;

    @IsString()
    @IsOptional()        
    slug?:string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number;

    @IsString({each:true})
    @IsArray()
    sizes: string [];

    @IsIn(['men','woman','kid','unisex'])
    gender:string;



}
