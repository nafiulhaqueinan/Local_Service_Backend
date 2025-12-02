import { Module } from '@nestjs/common';
import { ServiceProviderController } from './service-provider.controller';
import { ServiceProviderService } from './providers/service-provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from './service-provider.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProvider]),
    JwtModule.register({
      secret: 'SERVICE_PROVIDERS_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ServiceProviderController],
  providers: [ServiceProviderService],
  exports: [ServiceProviderService],
})
export class ServiceProviderModule {}
