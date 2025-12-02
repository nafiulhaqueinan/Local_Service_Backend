import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './providers/customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'CUSTOMERS_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
