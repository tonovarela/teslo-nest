import { Controller, Get} from '@nestjs/common';
import { SeedService } from './seed.service';
//import { Auth } from './../auth/decorators/auth.decorator';
//import { ValidRoles } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';


@Controller('seed')
@ApiTags("Seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Get()
  //@Auth(ValidRoles.admin)
  executeSeed() {
     return this.seedService.runSeed();
  }


}
