import { Customer } from 'src/customer/customer.entity';
import { ServiceProvider } from 'src/service-provider/service-provider.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (c) => c.bookings, { eager: true })
  customer: Customer;

  @ManyToOne(
    () => ServiceProvider,
    (serviceProvider) => serviceProvider.bookings,
    { eager: true },
  )
  provider: ServiceProvider;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
