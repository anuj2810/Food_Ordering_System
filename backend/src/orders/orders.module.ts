import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [PrismaModule],
  providers: [OrdersService, OrdersResolver]
})
export class OrdersModule { }
