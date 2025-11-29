import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './providers/customer.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
