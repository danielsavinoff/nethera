import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/Public.js';

@Public()
@Controller()
export class AppController {
  @Get('health')
  health() {}
}
