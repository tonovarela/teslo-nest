import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {

    @ApiProperty({
        default:10,description:"Cuantos quieres?"
    })
    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    //Transformar
    limit?:number;
    @ApiProperty({
        default:10,description:"Saltar tantos"
    })
    @IsOptional()    
    @Min(0)
    @Type(()=>Number)
    offset?:number;
    
}