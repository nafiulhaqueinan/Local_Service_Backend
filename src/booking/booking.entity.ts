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

  @ManyToOne(() => Customer, (c) => c.bookings, {
    // eager: true,
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @ManyToOne(
    () => ServiceProvider,
    (serviceProvider) => serviceProvider.bookings,
    {
      // eager: true,
      onDelete: 'CASCADE',
    },
  )
  provider: ServiceProvider;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
