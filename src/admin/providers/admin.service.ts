import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProvider } from 'src/service-provider/service-provider.entity';
import { Admin } from '../admin.entity';
import { AdminLoginDto } from '../dtos/admin-login.dto';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { emit } from 'process';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(ServiceProvider)
    private providerRepo: Repository<ServiceProvider>,
  ) {}

  public async login(adminLoginDto: AdminLoginDto) {
    const admin = await this.adminRepo.findOne({
      where: { email: adminLoginDto.email },
    });

    if (!admin) {
      throw new HttpException('Invalid credential', 400);
    }

    const validatePassword = await bcrypt.compare(
      adminLoginDto.password,
      admin.password,
    );

    if (!validatePassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    const payload = { sub: admin.id, email: adminLoginDto.email };

    const access_token = this.jwtService.sign(payload);

    return {
      email: adminLoginDto.email,
      access_token,
    };
  }

  public async listOfProviders() {
    const allProviders = await this.providerRepo.find();
    return allProviders.map(({ password, ...rest }) => rest);
  }

  public async deleteProviders(id: string) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
      },
    });

    console.log(provider);
    if (!provider) {
      throw new HttpException('Service provider not found', 404);
    }

    const result = await this.providerRepo.delete(id);

    if (!result.affected || result.affected === 0) {
      throw new HttpException('Provider not found. Delete failed.', 404);
    }

    return {
      email: provider.email,
      message: 'Provider deleted successfully',
    };
  }
}
