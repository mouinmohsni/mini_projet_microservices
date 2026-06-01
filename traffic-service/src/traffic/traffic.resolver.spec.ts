import { Test, TestingModule } from '@nestjs/testing';
import { TrafficResolver } from './traffic.resolver';

describe('TrafficResolver', () => {
  let resolver: TrafficResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficResolver],
    }).compile();

    resolver = module.get<TrafficResolver>(TrafficResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
