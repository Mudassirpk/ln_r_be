import { Test, TestingModule } from '@nestjs/testing';
import { IntrestController } from './intrest.controller';
import { IntrestService } from './intrest.service';

describe('IntrestController', () => {
  let controller: IntrestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntrestController],
      providers: [IntrestService],
    }).compile();

    controller = module.get<IntrestController>(IntrestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
