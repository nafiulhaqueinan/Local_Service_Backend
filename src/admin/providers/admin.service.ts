import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProvider } from 'src/service-provider/service-provider.entity';
import { Admin } from '../admin.entity';
import { AdminLoginDto } from '../dtos/admin-login.dto';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { emit } from 'process';
import { JwtService } from '@nestjs/jwt';
import { Customer } from 'src/customer/customer.entity';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
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
      email: admin.email,
      access_token,
    };
  }

  public async listOfProviders() {
    const allProviders = await this.providerRepo.find();
    return allProviders.map(({ password, ...rest }) => rest);
  }

  public async listOfCustomer() {
    const allCustomer = await this.customerRepo.find();
    return allCustomer.map(({ password, ...rest }) => rest);
  }

  public async deleteProviders(id: string) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
      },
    });

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

  public async deleteCustomer(id: number) {
    const customer = await this.customerRepo.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new HttpException('Service Provider not found', 404);
    }

    const result = await this.customerRepo.delete(id);

    if (!result.affected || result.affected === 0) {
      throw new HttpException('Customer not found. Delete failed.', 404);
    }

    return {
      email: customer.email,
      message: 'customer deleted successfully',
    };
  }

  async assignProvider(email: string, providerId: string) {
    const admin = await this.adminRepo.findOne({ where: { email } });

    if (!admin) {
      throw new HttpException('Admin not found', 404);
    }

    const provider = await this.providerRepo.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new HttpException('Service Provider not found', 404);
    }

    provider.admin = admin;
    await this.providerRepo.save(provider);

    return {
      assigned: true,
      email,
      providerId,
      message: 'Provider successfully assigned to admin',
    };
  }

  public async getProvidersUnderAdmin(email: string) {
    const admin = this.adminRepo.findOne({
      where: { email },
      relations: ['serviceProviders'],
      select: {
        id: true,
        email: true,
        serviceProviders: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          address: true,
          description: true,
          category: true,
          subcategory: true,
          price: true,
          profile_image_url: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });

    return admin;
  }
}
