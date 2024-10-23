import { Controller } from '@nestjs/common';
import { IntrestService } from './intrest.service';

@Controller('intrest')
export class IntrestController {
  constructor(private readonly intrestService: IntrestService) {}
}
