import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from './providers/customer.service';
import { CustomerRegisterDto } from './dtos/customer-register.dto';
import { CustomerLoginDto } from './dtos/customer-login.dto';
import { CustomerJwtAuthGuard } from './common/customer-jwt-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('signUp')
  signUp(@Body() customerRegisterDto: CustomerRegisterDto) {
    return this.customerService.register(customerRegisterDto);
  }

  @Post('login')
  login(@Body() customerloginDto: CustomerLoginDto) {
    return this.customerService.login(customerloginDto);
  }

  @UseGuards(CustomerJwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return this.customerService.getProfile(req.customer?.email);
  }
}
