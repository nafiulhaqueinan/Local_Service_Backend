import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './providers/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { ServiceProvider } from 'src/service-provider/service-provider.entity';
import { JwtModule } from '@nestjs/jwt';
import { Customer } from 'src/customer/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, ServiceProvider, Customer]),
    JwtModule.register({
      secret: 'ADMINS_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
