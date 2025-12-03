import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Booking } from '../booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/customer.entity';
import { ServiceProvider } from 'src/service-provider/service-provider.entity';
import { CreateBookingDto } from '../dtos/create-Booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(ServiceProvider)
    private spRepo: Repository<ServiceProvider>,
  ) {}

  async create(email: string, createBookingDto: CreateBookingDto) {
    const customer = await this.customerRepo.findOne({
      where: { email },
    });

    if (!customer) {
      throw new HttpException('Customer not found', 404);
    }

    const provider = await this.spRepo.findOne({
      where: { id: createBookingDto.providerId },
    });

    if (!provider) throw new HttpException('Provider not found', 404);

    const booking = this.bookingRepo.create({
      customer,
      provider,
      status: 'pending',
    });

    return await this.bookingRepo.save(booking);
  }

  async getByCustomer(email: string) {
    return this.bookingRepo.find({ where: { customer: { email } } });
  }

  async getByProvider(email: string) {
    // return this.bookingRepo.find({ where: { provider: { email } } });
    return this.bookingRepo.find({
      where: {
        provider: { email },
      },
      relations: ['provider', 'customer'],
      select: {
        id: true,
        status: true,
        provider: { fullName: true, email: true, phone: true },
        customer: { fullName: true, email: true, phone: true },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new HttpException('Not found', 404);
    booking.status = status;
    await this.bookingRepo.save(booking);
    return booking;
  }

  async getCompletedOrder(email: string) {
    return await this.bookingRepo.find({
      where: {
        provider: { email },
        status: 'complete',
      },
      relations: ['customer', 'provider'],
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          fullName: true,
          phone: true,
        },
        provider: {
          fullName: true,
          email: true,
          phone: true,
        },
      },
      order: { updatedAt: 'DESC' },
    });
  }

  async getByBookingId(id: number) {
    return this.bookingRepo.find({ where: { id } });
  }

  async getByProviderId(id: string) {
    const provider = await this.bookingRepo.findOne({
      where: {
        provider: { id },
      },
    });

    return provider;
  }
}
