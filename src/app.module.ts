import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceProviderModule } from './service-provider/service-provider.module';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [ServiceProviderModule, AdminModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
