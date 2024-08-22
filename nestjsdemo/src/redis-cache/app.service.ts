
import { Injectable } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Injectable()
export class AppService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async getCache(param): Promise<any> {
    const cachedValue = await this.redisCacheService.get(param.key);

    if (cachedValue) {
      return cachedValue;
    } else {
      
      return 'error';
    }
  }

  setCache(param): any {
    return this.redisCacheService.set(param.key, param.value);
  }
}