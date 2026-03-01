import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsResolver } from './payment-methods.resolver';

@Module({
  imports: [PrismaModule],
  providers: [PaymentMethodsService, PaymentMethodsResolver],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule { }
