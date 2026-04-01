import { Module } from '@nestjs/common';
import { RepublicsController } from './republics.controller';

@Module({
  controllers: [RepublicsController],
  providers: [],
})
export class RepublicsModule {}