import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './providers/booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customer/customer.entity';
import { ServiceProvider } from 'src/service-provider/service-provider.entity';
import { Booking } from './booking.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Customer, ServiceProvider])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
