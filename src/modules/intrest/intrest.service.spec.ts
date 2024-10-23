import { Test, TestingModule } from '@nestjs/testing';
import { IntrestService } from './intrest.service';

describe('IntrestService', () => {
  let service: IntrestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrestService],
    }).compile();

    service = module.get<IntrestService>(IntrestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
