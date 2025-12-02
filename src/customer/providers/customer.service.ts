import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer.entity';
import { Repository } from 'typeorm';
import { CustomerRegisterDto } from '../dtos/customer-register.dto';

import * as bcrypt from 'bcrypt';
import { CustomerLoginDto } from '../dtos/customer-login.dto';
import { JwtService } from '@nestjs/jwt';
import { emit } from 'process';

@Injectable()
export class CustomerService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async register(customerRegisterDto: CustomerRegisterDto) {
    const exists = await this.customerRepo.findOne({
      where: {
        email: customerRegisterDto.email,
      },
    });

    if (exists) {
      throw new HttpException('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(customerRegisterDto.password, 10);
    const customer = this.customerRepo.create({
      ...customerRegisterDto,
      password: hashedPassword,
    });

    const saved = await this.customerRepo.save(customer);
    return {
      id: saved.id,
      email: saved.email,
    };
  }

  async login(customerLoginDto: CustomerLoginDto) {
    const customer = await this.customerRepo.findOne({
      where: {
        email: customerLoginDto.email,
      },
    });

    if (!customer) {
      throw new HttpException('Invalid Credential', 400);
    }

    const validatePassword = await bcrypt.compare(
      customerLoginDto.password,
      customer.password,
    );

    if (!validatePassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    const payload = { sub: customer.id, email: customerLoginDto.email };
    const access_token = this.jwtService.sign(payload);

    return {
      email: customerLoginDto.email,
      access_token,
    };
  }

  public async getProfile(email: string) {
    const customer = await this.customerRepo.findOneBy({
      email,
    });

    if (!customer) {
      throw new HttpException('customer not found', 404);
    }
    const { id, password, ...result } = customer;
    return result;
  }
}
