import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './providers/booking.service';
import { CreateBookingDto } from './dtos/create-Booking.dto';
import { CustomerJwtAuthGuard } from 'src/customer/common/customer-jwt-auth.guard';
import { JwtAuthGuard } from 'src/service-provider/common/jwt-auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(CustomerJwtAuthGuard)
  @Post('create')
  create(@Req() req: any, @Body() createbookingDto: CreateBookingDto) {
    const customerId = req.customer?.email;
    return this.bookingService.create(customerId, createbookingDto);
  }

  @UseGuards(CustomerJwtAuthGuard)
  @Get('customer')
  myBookings(@Req() req: any) {
    return this.bookingService.getByCustomer(req.customer?.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider')
  providerBookings(@Req() req: any) {
    return this.bookingService.getByProvider(req.provider?.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status/:id')
  providerUpdateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.bookingService.updateStatus(id, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('completed-order')
  completedOrder(@Req() req: any) {
    return this.bookingService.getCompletedOrder(req.provider.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getbyProviderId/:id')
  getAll(@Param('id') id: string) {
    return this.bookingService.getByProviderId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getbyBooking/:id')
  public getBybookingId(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.getByBookingId(id);
  }
}
