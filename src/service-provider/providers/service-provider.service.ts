import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceProvider } from '../service-provider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderRegisterDto } from '../dtos/provider-register.dto';

import * as bcrypt from 'bcrypt';
import { MainCategoryEnum } from '../enums/main-category.enum';
import { ProviderRegisterResponseDto } from '../dtos/provider-register-response.dto';
import { ProviderLoginDto } from '../dtos/provider-login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateProviderCategoryDto } from '../dtos/update-provider-category.dto';

@Injectable()
export class ServiceProviderService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepository: Repository<ServiceProvider>,
  ) {}

  public async signUp(
    providerRegisterDto: ProviderRegisterDto,
  ): Promise<ProviderRegisterResponseDto> {
    const exists = await this.serviceProviderRepository.findOne({
      where: { email: providerRegisterDto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already exist');
    }

    const hashedPassword = await bcrypt.hash(providerRegisterDto.password, 10);

    let subcategory: string;
    switch (providerRegisterDto.category) {
      case MainCategoryEnum.HOUSEHOLD:
        subcategory = providerRegisterDto.householdService;
        break;

      case MainCategoryEnum.TECHNOLOGY:
        subcategory = providerRegisterDto.technologyService;
        break;

      case MainCategoryEnum.VEHICLE:
        subcategory = providerRegisterDto.vehicleService;

      default:
        throw new BadRequestException('Invalid category selected');
    }

    if (!subcategory) {
      throw new BadRequestException('Subcategory is reuired');
    }

    const serviceProvider = this.serviceProviderRepository.create({
      fullName: providerRegisterDto.fullName,
      email: providerRegisterDto.email,
      password: hashedPassword,
      phone: providerRegisterDto.phone,
      address: providerRegisterDto.address,
      description: providerRegisterDto.description,
      category: providerRegisterDto.category,
      subcategory: subcategory,
      price: providerRegisterDto.price,
      profile_image_url: providerRegisterDto.profile_image_url,
    });

    const saved = await this.serviceProviderRepository.save(serviceProvider);
    const { password, ...result } = saved;
    return result;
  }

  public async login({ email, password }: ProviderLoginDto) {
    const provider = await this.serviceProviderRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!provider) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const validPassword = await bcrypt.compare(password, provider.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { sub: provider.id, email: email };
    const access_token = this.jwtService.sign(payload);

    return {
      email,
      access_token,
    };
  }

  public async getProfile(email: string) {
    const provider = await this.serviceProviderRepository.findOneBy({
      email,
    });

    if (!provider) {
      throw new NotFoundException('service-provider not found');
    }
    const { id, password, ...result } = provider;
    return result;
  }

  public async updatePrice(email: string, price: number) {
    const provider = await this.serviceProviderRepository.findOne({
      where: { email },
    });

    if (!provider) {
      throw new HttpException('Provider not found', 404);
    }

    await this.serviceProviderRepository.update(provider.id, { price: price });

    return {
      updated: true,
      providerId: provider.id,
      newPrice: price,
      message: 'Price updated successfully',
    };
  }

  public async updateCategory(
    email: string,
    updateProviderCategorydto: UpdateProviderCategoryDto,
  ) {
    const provider = await this.serviceProviderRepository.findOne({
      where: { email },
    });

    if (!provider) {
      throw new HttpException('Provider Not Found', 404);
    }

    let subcategory: string;
    switch (updateProviderCategorydto.category) {
      case MainCategoryEnum.HOUSEHOLD:
        subcategory = updateProviderCategorydto.householdService;
        break;

      case MainCategoryEnum.TECHNOLOGY:
        subcategory = updateProviderCategorydto.technologyService;
        break;

      case MainCategoryEnum.VEHICLE:
        subcategory = updateProviderCategorydto.vehicleService;
        break;

      default:
        throw new BadRequestException('Invalid category selected');
    }

    await this.serviceProviderRepository.update(provider.id, {
      category: updateProviderCategorydto.category,
      subcategory,
    });

    return {
      updated: true,
      providerId: provider.id,
      email: provider.email,
      newCategory: updateProviderCategorydto.category,
      subcategory: subcategory,
      message: 'Category updated successfully',
    };
  }
}
