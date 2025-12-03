import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './providers/admin.service';
import { AdminLoginDto } from './dtos/admin-login.dto';
import { AdminJwtAuthGuard } from './common/admin-jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  public login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('providers')
  public getProviders() {
    return this.adminService.listOfProviders();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('customers')
  public getCustomer() {
    return this.adminService.listOfCustomer();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('provider/:id')
  public deleteProvider(@Param('id') id: string) {
    return this.adminService.deleteProviders(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('customer/:id')
  public deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCustomer(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post('assign-provider/:providerId')
  assignProvider(@Req() req, @Param('providerId') providerId: string) {
    return this.adminService.assignProvider(req.admin?.email, providerId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('my-providers')
  getMyProviders(@Req() req) {
    return this.adminService.getProvidersUnderAdmin(req.admin?.email);
  }
}
