import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
  @Delete('provider/:id')
  public deleteProvider(@Param('id') id: string) {
    return this.adminService.deleteProviders(id);
  }
}
